export const normalizeModuleId = (value) => {
  if (value === undefined || value === null) {
    return '';
  }
  if (typeof value === 'number') {
    return String(value);
  }
  if (typeof value === 'string') {
    return value.trim();
  }
  return String(value);
};

const toTopicArray = (module) => {
  if (module?.pathway?.topics && Array.isArray(module.pathway.topics)) {
    return module.pathway.topics;
  }
  if (Array.isArray(module?.topics)) {
    return module.topics;
  }
  return [];
};

const clonePathway = (module, topics) => {
  const original = module?.pathway || {};
  return {
    ...original,
    topics,
    topicEdges: Array.isArray(original.topicEdges) ? [...original.topicEdges] : []
  };
};

const toCompletedTopicSet = (completedTopics) => {
  if (!completedTopics) {
    return new Set();
  }
  if (completedTopics instanceof Set) {
    return new Set(completedTopics);
  }
  if (Array.isArray(completedTopics)) {
    return new Set(completedTopics);
  }
  return new Set();
};

const sortModules = (modules = []) => {
  return [...modules].sort((a, b) => {
    const seqA = typeof a?.sequence === 'number' ? a.sequence : Number.parseInt(a?.sequence ?? '0', 10) || 0;
    const seqB = typeof b?.sequence === 'number' ? b.sequence : Number.parseInt(b?.sequence ?? '0', 10) || 0;

    if (seqA === seqB) {
      const idA = normalizeModuleId(a?.id ?? a?.code ?? a?.moduleId ?? '');
      const idB = normalizeModuleId(b?.id ?? b?.code ?? b?.moduleId ?? '');
      return idA.localeCompare(idB);
    }

    return seqA - seqB;
  });
};

export const computePathwayProgress = (modules = [], completedTopics = []) => {
  const completedTopicIds = toCompletedTopicSet(completedTopics);
  const orderedModules = sortModules(modules);

  const decoratedModules = [];
  const completedModuleIds = new Set();
  let totalTopics = 0;
  let completedTopicCount = 0;
  let nextTopic = null;

  for (const module of orderedModules) {
    const moduleId = normalizeModuleId(module?.id ?? module?.code ?? module?.moduleId);
    const prerequisiteModules = Array.isArray(module?.prerequisiteModules)
      ? module.prerequisiteModules.map((id) => normalizeModuleId(id))
      : [];

    const moduleUnlocked = prerequisiteModules.length === 0
      || prerequisiteModules.every((prereqId) => completedModuleIds.has(prereqId));

    const rawTopics = toTopicArray(module);
    const topics = rawTopics.map((topic, index) => {
      const prerequisites = Array.isArray(topic?.prerequisites) ? topic.prerequisites : [];
      const normalizedPrereqs = prerequisites.map((id) => String(id));
      const completed = completedTopicIds.has(topic?.id);
      const prerequisitesMet = normalizedPrereqs.every((id) => completedTopicIds.has(id));
      const unlocked = moduleUnlocked && prerequisitesMet;

      return {
        order: (index + 1),
        ...topic,
        prerequisites: normalizedPrereqs,
        completed,
        unlocked,
        moduleId,
      };
    });

    const completedTopicsInModule = topics.filter((topic) => topic.completed).length;
    const moduleHasTopics = topics.length > 0;
    const moduleCompleted = moduleHasTopics && completedTopicsInModule === topics.length;

    if (moduleCompleted) {
      completedModuleIds.add(moduleId);
    }

    const moduleNextTopic = moduleUnlocked
      ? topics.find((topic) => !topic.completed && topic.unlocked)
      : null;

    if (!nextTopic && moduleNextTopic) {
      nextTopic = {
        ...moduleNextTopic,
        moduleId,
        moduleName: module?.name,
        subjectId: module?.subject || module?.subjectId || null,
      };
    }

    totalTopics += topics.length;
    completedTopicCount += completedTopicsInModule;

    decoratedModules.push({
      ...module,
      id: module?.id ?? moduleId,
      moduleId,
      prerequisiteModules,
      topicsCount: topics.length,
      completedTopics: completedTopicsInModule,
      progress: moduleHasTopics ? Math.round((completedTopicsInModule / topics.length) * 100) : 0,
      unlocked: moduleUnlocked,
      completed: moduleCompleted,
      nextTopic: moduleNextTopic
        ? {
            ...moduleNextTopic,
            moduleId,
            moduleName: module?.name,
            subjectId: module?.subject || module?.subjectId || null,
          }
        : null,
      pathway: clonePathway(module, topics),
      topics,
    });
  }

  const progressPercent = totalTopics > 0
    ? Math.round((completedTopicCount / totalTopics) * 100)
    : 0;

  return {
    modules: decoratedModules,
    totalTopics,
    completedTopics: completedTopicCount,
    completedModuleIds: Array.from(completedModuleIds),
    completedTopicIds: Array.from(completedTopicIds),
    progressPercent,
    nextTopic,
  };
};

export const buildSubjectOverview = (subject = {}, modules = [], subjectProgress = {}) => {
  const completedTopics = Array.isArray(subjectProgress?.completedTopics)
    ? subjectProgress.completedTopics
    : [];

  const {
    modules: enrichedModules,
    totalTopics,
    completedTopics: completedTopicsCount,
    progressPercent,
    nextTopic,
    completedModuleIds,
  } = computePathwayProgress(modules, completedTopics);

  return {
    ...subject,
    modules: enrichedModules,
    totalTopics,
    completedTopics: completedTopicsCount,
    completedModuleIds,
    progress: progressPercent,
    nextTopic,
    level: subjectProgress?.level ?? 1,
    totalXP: subjectProgress?.totalXP ?? 0,
    streak: subjectProgress?.streak ?? 0,
    lastStudied: subjectProgress?.lastStudied ?? null,
  };
};
