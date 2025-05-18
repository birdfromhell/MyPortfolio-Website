export const technoTypes = [
    'language',
    'framework',
    'library',
    'database',
    'development-tool',
    'devops',
    'CMS'
] as const;

const technoTypesLabels: Record<TechnoType, Record<string, string>> = {
    language: {
        en: 'Language',
        id: 'Bahasa'
    },
    framework: {
        en: 'Framework',
        id: 'Kerangka kerja'
    },
    library: {
        en: 'Library',
        id: 'Pustaka'
    },
    database: {
        en: 'Database',
        id: 'Basis data'
    },
    'development-tool': {
        en: 'Development Tool',
        id: 'Alat pengembangan'
    },
    devops: {
        en: 'DevOps',
        id: 'DevOps'
    },
    'CMS': {
        en: 'CMS',
        id: 'CMS'
    },
};

export function getTechnoTypeLabel(type: TechnoType) {
    const { locale } = useI18n();
    return technoTypesLabels[type][locale.value];
}

type TechnoType = (typeof technoTypes)[number];

type Techno = {
    title: string;
    icon?: string;
    image?: string;
    type: TechnoType;
    url: string;
    iconName?: string;
};

export const projectTypes = [
    'featured',
    'game',
    'web',
    'scripting',
    'desktop',
] as const;

const projectTypesLabels: Record<ProjectType, Record<string, string>> = {
    featured: {
        en: 'Featured',
        id: 'Featured'
    },
    game: {
        en: 'Game',
        id: 'Game'
    },
    web: {
        en: 'Web',
        id: 'Web'
    },
    scripting: {
        en: 'Scripting',
        id: 'Script'
    },
    desktop: {
        en: 'Desktop',
        id: 'Desktop'
    },
};

export function getProjectTypeLabel(type: ProjectType) {
    const { locale } = useI18n();
    return projectTypesLabels[type][locale.value];
}

type ProjectType = (typeof projectTypes)[number];

type Locale = 'en' | 'id';

type Project = {
    name: string;
    description: Record<Locale, string>;
    date: string;
    type: ProjectType[];
    technos: string[];
    link: string;
    repo_link: string;
};

type Hobby = {
    title: Record<Locale, string>;
    icon: string;
    emoji: string;
};

export type Experience = {
    company: string;
    companyUrl: string;
    position: string;
    period: {
      start: string;
      end: string;
    };
    type: 'apprenticeship' | 'internship' | 'job';
    description: {
      en: string[];
      id: string[];
      [key: string]: string[]; // Add index signature
    };
    technologies: string[];
  };

export type { Hobby, Locale, Project, ProjectType, Techno, TechnoType };
