/**
 * experience.js — Interactive Bastione experience constellation.
 */

const EXPERIENCE_DATA = {
    arrive: {
      index: '01',
      titleKey: 'experience.nodes.arrive.title',
      textKey: 'experience.nodes.arrive.text',
      value: '20',
      detailKey: 'experience.nodes.arrive.detail',
    },
  
    view: {
      index: '02',
      titleKey: 'experience.nodes.view.title',
      textKey: 'experience.nodes.view.text',
      value: '130',
      detailKey: 'experience.nodes.view.detail',
    },
  
    taste: {
      index: '03',
      titleKey: 'experience.nodes.taste.title',
      textKey: 'experience.nodes.taste.text',
      value: '2',
      detailKey: 'experience.nodes.taste.detail',
    },
  
    aperitivo: {
      index: '04',
      titleKey: 'experience.nodes.aperitivo.title',
      textKey: 'experience.nodes.aperitivo.text',
      value: '1',
      detailKey: 'experience.nodes.aperitivo.detail',
    },
  
    stay: {
      index: '05',
      titleKey: 'experience.nodes.stay.title',
      textKey: 'experience.nodes.stay.text',
      value: '∞',
      detailKey: 'experience.nodes.stay.detail',
    },
  };
  
  const getTranslation = (key) => {
    const element = document.querySelector(`[data-i18n="${key}"]`);
  
    return element?.textContent.trim() || '';
  };
  
  const initExperience = () => {
    const section = document.querySelector('#experience');
  
    if (!section) {
      return;
    }
  
    const visual = section.querySelector('.experience__visual');
    const nodes = [...section.querySelectorAll('[data-experience-node]')];
    const storyIndex = section.querySelector('.experience__story-index');
    const storyTitle = section.querySelector('[data-experience-story-title]');
    const storyText = section.querySelector('[data-experience-story-text]');
    const storyValue = section.querySelector('[data-experience-story-value]');
    const storyLabel = section.querySelector('[data-experience-story-label]');
  
    if (
      !visual ||
      !nodes.length ||
      !storyIndex ||
      !storyTitle ||
      !storyText ||
      !storyValue ||
      !storyLabel
    ) {
      return;
    }
  
    let activeNode = 'arrive';
  
    const updateStory = (key, animate = true) => {
      const data = EXPERIENCE_DATA[key];
  
      if (!data) {
        return;
      }
  
      if (animate) {
        storyTitle.classList.add('is-changing');
        storyText.classList.add('is-changing');
  
        window.setTimeout(() => {
          storyIndex.textContent = data.index;
          storyTitle.textContent = getTranslation(data.titleKey);
          storyText.textContent = getTranslation(data.textKey);
          storyValue.textContent = data.value;
          storyLabel.textContent = getTranslation(data.detailKey);
  
          storyTitle.classList.remove('is-changing');
          storyText.classList.remove('is-changing');
        }, 180);
  
        return;
      }
  
      storyIndex.textContent = data.index;
      storyTitle.textContent = getTranslation(data.titleKey);
      storyText.textContent = getTranslation(data.textKey);
      storyValue.textContent = data.value;
      storyLabel.textContent = getTranslation(data.detailKey);
    };
  
    const activateNode = (key, animate = true) => {
      if (!EXPERIENCE_DATA[key] || key === activeNode && animate) {
        return;
      }
  
      activeNode = key;
  
      nodes.forEach((node) => {
        const isActive = node.dataset.experienceNode === key;
  
        node.classList.toggle('is-active', isActive);
        node.setAttribute('aria-pressed', String(isActive));
      });
  
      visual.classList.add('is-active');
  
      updateStory(key, animate);
    };
  
    nodes.forEach((node) => {
      node.addEventListener('click', () => {
        activateNode(node.dataset.experienceNode);
      });
  
      node.addEventListener('focus', () => {
        activateNode(node.dataset.experienceNode);
      });
    });
  
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          return;
        }
  
        visual.classList.add('is-active');
  
        nodes.forEach((node, index) => {
          window.setTimeout(() => {
            node.classList.add('is-visible');
          }, 180 + index * 110);
        });
  
        observer.unobserve(section);
      },
      {
        threshold: 0.2,
      }
    );
  
    observer.observe(section);
  
    updateStory(activeNode, false);
};
  
export default initExperience;