// 模块加载器
const sectionLoaders = {
  life: () => import("../life/index.js").then(module => module.initLife()),
  music: () => import("../music/index.js").then(module => module.initMusic()),
  study: () => import("../study/index.js").then(module => module.initStudy()),
}

// 缓存加载数据
// 记录已初始化过的模块
const loadedSections = new Set()
// 记录正在加载的模块,防止用户连续点击时重复import()
const loadingSections = new Map();

export async function loadSectionModule(sectionId) {
  const loader = sectionLoaders[sectionId];

  if (!loader) return;
  if (loadedSections.has(sectionId)) return;

  if (loadingSections.has(sectionId)) return loadingSections.get(sectionId);

  const loadingTask = loader()
    .then(() => {
      loadedSections.add(sectionId);
    }).catch(error => {
      loadedSections.delete(sectionId);
      throw error;
    }).finally(() => {
      loadingSections.delete(sectionId);
    });

  loadingSections.set(sectionId, loadingTask);

  return loadingTask;
}