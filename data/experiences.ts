import type { Experience } from './types';

export const experiences: Experience[] = [
  {
    company: 'PT Erka Solution Group',
    companyUrl: 'https://erka.co.id',
    position: 'devopsDeveloper',
    period: {
      start: '2024',
      end: '2025'
    },
    type: 'apprenticeship',
    description: {
      en: [
        'Project to migrate over 10,000 projects from GitLab to GitHub. I implemented automation scripts to streamline the migration process. My responsibilities included coordinating with application teams to ensure a smooth transition, managing workflows, and conducting tests to ensure the reliability of the migrations.',
        'Currently, I am expanding my expertise in Cloud & DevOps, and I am actively working on projects in these areas. As part of an international virtual team, I am enhancing my skills in communication, teamwork, and automation, contributing to the success of our initiatives.'
      ],
      id: [
        'Proyek untuk memigrasikan lebih dari 10.000 proyek dari GitLab ke GitHub. Saya mengimplementasikan skrip otomatisasi untuk merampingkan proses migrasi. Tanggung jawab saya termasuk berkoordinasi dengan tim aplikasi untuk memastikan transisi yang lancar, mengelola alur kerja, dan melakukan pengujian untuk memastikan keandalan migrasi.',
        'Saat ini, saya sedang memperluas keahlian saya dalam Cloud & DevOps, dan saya aktif mengerjakan proyek-proyek di bidang ini. Sebagai bagian dari tim virtual internasional, saya meningkatkan keterampilan saya dalam komunikasi, kerja tim, dan otomatisasi, berkontribusi pada keberhasilan inisiatif kami.'
      ]
    },
    technologies: [
      'GitHub',
      'GitHub Actions',
      'Python',
      'Terraform',
      'AWS'
    ]
  },
  {
    company: 'Senzu',
    companyUrl: 'https://welcome.senzu.app',
    position: 'fullStack',
    period: {
      start: 'April 2023',
      end: 'June 2023'
    },
    type: 'internship',
    description: {
      en: [
        'As a Full-Stack Developer, I have honed my skills in managing the whole Senzu API, handling the addition of new features and updating dependencies independently. I have also developed modules for various connected devices. This experience has provided me with valuable exposure to the corporate IT world, deepening my understanding of industry practices and workflows.'
      ],
      id: [
        'Sebagai Pengembang Full-Stack, saya telah mengasah keterampilan saya dalam mengelola seluruh API Senzu, menangani penambahan fitur baru dan memperbarui dependensi secara mandiri. Saya juga telah mengembangkan modul untuk berbagai perangkat yang terhubung. Pengalaman ini telah memberi saya paparan berharga ke dunia TI perusahaan, memperdalam pemahaman saya tentang praktik dan alur kerja industri.'
      ]
    },
    technologies: [
      'PHP',
      'JavaScript',
      'HTML',
      'CSS',
      'Symfony',
      'MySQL'
    ]
  }
];