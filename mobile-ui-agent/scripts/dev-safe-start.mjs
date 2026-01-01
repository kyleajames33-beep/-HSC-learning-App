#!/usr/bin/env node
import { spawn } from 'node:child_process'
import { existsSync, mkdirSync } from 'node:fs'
import path from 'node:path'
import killPort from 'kill-port'
import dotenv from 'dotenv'

const projectRoot = process.cwd()
const envPath = path.join(projectRoot, '.env')

dotenv.config({ path: envPath })

const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm'

const fallbackPort = 3000
const rawPort = process.env.VITE_PORT || process.env.PORT
const targetPort = Number.parseInt(rawPort ?? '', 10) || fallbackPort

const defaultHost = 'localhost'
const host = (process.env.VITE_HOST || defaultHost).trim() || defaultHost

const tailwindPackageJson = path.join(projectRoot, 'node_modules', 'tailwindcss', 'package.json')

const runCommand = (command, args, options = {}) =>
  new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: 'inherit',
      windowsHide: true,
      shell: process.platform === 'win32',
      ...options
    })

    child.on('close', (code) => {
      if (code === 0) {
        resolve()
      } else {
        reject(new Error(`${command} ${args.join(' ')} exited with code ${code}`))
      }
    })

    child.on('error', (error) => {
      reject(error)
    })
  })

const ensureDevDependencies = async () => {
  if (existsSync(tailwindPackageJson)) {
    return
  }

  console.log('[dev-safe] Missing devDependencies detected. Running npm install --include=dev …')
  await runCommand(npmCommand, ['install', '--include=dev'], {
    env: {
      ...process.env,
      NODE_ENV: 'development',
      NPM_CONFIG_PRODUCTION: 'false'
    }
  })
}

const freePort = async (port) => {
  try {
    await killPort(port, 'tcp')
    console.log(`[dev-safe] Cleared TCP port ${port}`)
  } catch (error) {
    const message = String(error?.message ?? '')
    const noProcess =
      message.includes('There was an error') && message.includes('not running on port')

    if (!noProcess) {
      console.warn(`[dev-safe] Unable to kill port ${port}: ${message}`)
    }
  }
}

const startVite = async (port) => {
  await runCommand(npmCommand, ['run', 'dev', '--', '--host', host, '--port', String(port)], {
    env: {
      ...process.env,
      NODE_ENV: 'development',
      NPM_CONFIG_PRODUCTION: 'false',
      VITE_PORT: String(port),
      VITE_HOST: host
    }
  })
}

const main = async () => {
  // Ensure scripts directory exists if invoked from other locations
  const scriptsDir = path.join(projectRoot, 'scripts')
  if (!existsSync(scriptsDir)) {
    mkdirSync(scriptsDir, { recursive: true })
  }

  await ensureDevDependencies()
  await freePort(targetPort)
  await startVite(targetPort)
}

main().catch((error) => {
  console.error('[dev-safe] Failed to start development server:', error)
  process.exit(1)
})
