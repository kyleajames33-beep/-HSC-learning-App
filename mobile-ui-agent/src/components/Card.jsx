import React from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  ArrowRight,
  Gamepad2,
  Minus,
  Target,
  TrendingDown,
  TrendingUp
} from 'lucide-react';

const cn = (...classes) => classes.filter(Boolean).join(' ');

const VARIANT_STYLES = {
  default: 'bg-white/80 border-white/60 shadow-sm',
  subtle: 'bg-white border-gray-100 shadow-sm',
  accent: 'bg-gradient-to-br from-blue-50 via-white to-purple-50 border-blue-100 shadow-md',
  success: 'bg-green-50 border-green-100 shadow-sm',
  danger: 'bg-red-50 border-red-100 shadow-sm',
  dark: 'bg-slate-900 border-slate-800 text-slate-100 shadow-lg'
};

const TREND_META = {
  positive: {
    chip: 'bg-green-100 text-green-700',
    icon: <TrendingUp className="h-3.5 w-3.5" aria-hidden="true" />
  },
  negative: {
    chip: 'bg-red-100 text-red-600',
    icon: <TrendingDown className="h-3.5 w-3.5" aria-hidden="true" />
  },
  neutral: {
    chip: 'bg-gray-100 text-gray-600',
    icon: <Minus className="h-3.5 w-3.5" aria-hidden="true" />
  }
};

const clampProgress = (value) => {
  if (Number.isNaN(value)) return 0;
  return Math.min(100, Math.max(0, Number(value)));
};

const renderIconNode = (icon) => {
  if (!icon) return null;
  if (React.isValidElement(icon)) return icon;
  if (typeof icon === 'string') {
    return (
      <span className="text-lg font-semibold text-blue-600">
        {icon}
      </span>
    );
  }
  return null;
};

const Card = ({
  title,
  description,
  icon,
  badge,
  footer,
  actions,
  children,
  variant = 'default',
  className = '',
  interactive = false,
  onClick,
  showCaret = true,
  iconBackground = 'bg-blue-50 text-blue-600',
  ...props
}) => {
  const clickable = interactive || typeof onClick === 'function';
  const motionHover = clickable ? { y: -4, scale: 1.01 } : undefined;
  const motionTap = clickable ? { scale: 0.99 } : undefined;
  const cardClasses = cn(
    'relative overflow-hidden rounded-2xl border backdrop-blur-sm transition-all duration-200',
    VARIANT_STYLES[variant] || VARIANT_STYLES.default,
    clickable ? 'cursor-pointer hover:shadow-lg' : '',
    className
  );

  return (
    <motion.div
      className={cardClasses}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={motionHover}
      whileTap={motionTap}
      onClick={onClick}
      role={clickable ? 'button' : 'group'}
      {...props}
    >
      <div className="flex flex-col space-y-4 p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            {icon && (
              <div className={cn('flex h-12 w-12 items-center justify-center rounded-xl', iconBackground)}>
                {renderIconNode(icon)}
              </div>
            )}
            <div className="flex-1">
              {badge && (
                <span className="inline-flex items-center rounded-full bg-black/10 px-2 py-0.5 text-xs font-medium text-black/60">
                  {badge}
                </span>
              )}
              {title && (
                <h3 className="mt-1 text-lg font-semibold text-gray-900">
                  {title}
                </h3>
              )}
              {description && (
                <p className="mt-1 text-sm text-gray-600">
                  {description}
                </p>
              )}
            </div>
          </div>
          {actions && (
            <div className="flex items-center gap-2">
              {actions}
            </div>
          )}
        </div>

        {children}

        {footer && (
          <div className="mt-2 border-t border-black/5 pt-4 text-sm text-gray-600">
            {footer}
          </div>
        )}
      </div>

      {clickable && showCaret && !actions && (
        <ArrowRight className="absolute right-6 top-6 h-5 w-5 text-gray-400" aria-hidden="true" />
      )}
    </motion.div>
  );
};

export const StatCard = ({
  title,
  description,
  value,
  delta,
  trend = 'neutral',
  icon = <Activity className="h-5 w-5" aria-hidden="true" />,
  footer,
  className = '',
  ...props
}) => {
  const trendInfo = TREND_META[trend] || TREND_META.neutral;

  return (
    <Card
      title={title}
      description={description}
      icon={icon}
      footer={footer}
      className={cn('min-h-[160px]', className)}
      {...props}
    >
      <div className="mt-4 flex items-end justify-between">
        <span className="text-3xl font-bold text-gray-900">
          {value}
        </span>
        {delta && (
          <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium', trendInfo.chip)}>
            {trendInfo.icon}
            <span className="ml-1">{delta}</span>
          </span>
        )}
      </div>
    </Card>
  );
};

export const GameCard = ({
  title,
  description,
  statusLabel = 'Ready',
  progress = 0,
  durationLabel,
  playersLabel,
  icon = <Gamepad2 className="h-5 w-5" aria-hidden="true" />,
  onClick,
  className = '',
  ...props
}) => {
  const safeProgress = clampProgress(progress);

  return (
    <Card
      title={title}
      description={description}
      icon={icon}
      variant="accent"
      interactive
      onClick={onClick}
      className={cn('border-blue-100 shadow-lg', className)}
      {...props}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-gray-600">Status</span>
          <span className="font-semibold text-blue-700">{statusLabel}</span>
        </div>

        <div>
          <div className="mb-1 flex items-center justify-between text-xs text-gray-600">
            <span>Progress</span>
            <span className="font-medium text-gray-900">{safeProgress}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-white/60">
            <div
              className="h-2 rounded-full bg-blue-600 transition-all duration-300"
              style={{ width: `${safeProgress}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs text-gray-600">
          {durationLabel && (
            <div className="rounded-lg bg-white/60 p-2">
              <span className="block text-[11px] uppercase tracking-wide text-gray-500">
                Duration
              </span>
              <span className="mt-1 block text-sm font-semibold text-gray-800">
                {durationLabel}
              </span>
            </div>
          )}
          {playersLabel && (
            <div className="rounded-lg bg-white/60 p-2">
              <span className="block text-[11px] uppercase tracking-wide text-gray-500">
                Players
              </span>
              <span className="mt-1 block text-sm font-semibold text-gray-800">
                {playersLabel}
              </span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export const QuizCard = ({
  title,
  description,
  questions = 10,
  difficulty = 'Medium',
  timeLimit,
  rewardXP,
  attempts = 0,
  icon = <Target className="h-5 w-5" aria-hidden="true" />,
  onClick,
  footer,
  className = '',
  ...props
}) => {
  const infoRows = [
    { label: 'Questions', value: questions ? String(questions) : 'N/A' },
    { label: 'Difficulty', value: difficulty },
    timeLimit ? { label: 'Time Limit', value: timeLimit } : null,
    rewardXP ? { label: 'Reward', value: `${rewardXP} XP` } : null,
    attempts ? { label: 'Attempts', value: String(attempts) } : null
  ].filter(Boolean);

  return (
    <Card
      title={title}
      description={description}
      icon={icon}
      interactive
      onClick={onClick}
      footer={footer}
      className={cn('hover:border-blue-200', className)}
      {...props}
    >
      <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
        {infoRows.map((row) => (
          <div key={row.label} className="rounded-lg border border-gray-100 bg-gray-50 p-3">
            <span className="block text-xs uppercase tracking-wide text-gray-500">
              {row.label}
            </span>
            <span className="mt-1 block font-semibold text-gray-900">
              {row.value}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default Card;
