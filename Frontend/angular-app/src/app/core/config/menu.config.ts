import { Permission } from '../enums/permission.enum';
import { Role } from '../enums/role.enum';

export interface MenuItem {
  label: string;
  icon: string;
  route?: string;
  permissions?: Permission[];
  roles?: Role[];
  children?: MenuItem[];
  divider?: boolean;
  header?: string;
}

export const MENU_ITEMS: MenuItem[] = [
  // Dashboard - ADMIN only
  {
    label: 'Dashboard',
    icon: 'dashboard',
    route: '/dashboard',
    roles: [Role.ADMIN]
  },

  // Course Management - ADMIN
  {
    label: 'Course Management',
    icon: 'school',
    route: '/dashboard/courses',
    roles: [Role.ADMIN]
  },

  // Exam Management - ADMIN
  {
    label: 'Exam Management',
    icon: 'assignment',
    route: '/dashboard/exams',
    roles: [Role.ADMIN]
  },

  // Training Management - ADMIN
  {
    label: 'Training Management',
    icon: 'fitness_center',
    route: '/dashboard/training',
    roles: [Role.ADMIN]
  },

  // Certification & Badge Management - ADMIN
  {
    label: 'Certifications & Badges',
    icon: 'workspace_premium',
    route: '/dashboard/certifications',
    roles: [Role.ADMIN]
  },

  // Skill Evidence - ADMIN
  {
    label: 'Skill Evidence',
    icon: 'psychology',
    route: '/dashboard/skill-evidence',
    roles: [Role.ADMIN]
  },

  // Interview Management - ADMIN
  {
    label: 'Interview Management',
    icon: 'event_seat',
    route: '/dashboard/interviews',
    roles: [Role.ADMIN]
  },

  // Job Offers - ADMIN
  {
    label: 'Job Offers',
    icon: 'work',
    route: '/dashboard/job-offers',
    roles: [Role.ADMIN]
  },

  // Planning/Schedule - ADMIN
  {
    label: 'Planning',
    icon: 'calendar_month',
    route: '/dashboard/planning',
    roles: [Role.ADMIN]
  },

  // Event Management - ADMIN
  {
    label: 'Event Management',
    icon: 'event',
    route: '/dashboard/events',
    roles: [Role.ADMIN]
  },

  // User Management - ADMIN
  {
    label: 'User Management',
    icon: 'people',
    route: '/dashboard/users',
    roles: [Role.ADMIN]
  },

  // Company Management - ADMIN
  {
    label: 'Company Management',
    icon: 'business',
    route: '/dashboard/companies',
    roles: [Role.ADMIN]
  },

  // Sponsor Management - ADMIN
  {
    label: 'Sponsor Management',
    icon: 'handshake',
    route: '/dashboard/sponsors',
    roles: [Role.ADMIN]
  },

  // Contact Management - ADMIN
  {
    label: 'Contact Management',
    icon: 'contacts',
    route: '/dashboard/contacts',
    roles: [Role.ADMIN]
  },

  // Participation - ADMIN
  {
    label: 'Participation',
    icon: 'groups',
    route: '/dashboard/participation',
    roles: [Role.ADMIN]
  },

  // Learning Path - ADMIN
  {
    label: 'Learning Paths',
    icon: 'route',
    route: '/dashboard/learning-paths',
    roles: [Role.ADMIN]
  },

  // Divider
  {
    label: '',
    icon: '',
    divider: true
  },

  // Header for Settings
  {
    label: '',
    icon: '',
    header: 'Settings'
  },

  // System Settings - ADMIN
  {
    label: 'System Settings',
    icon: 'settings',
    route: '/dashboard/settings',
    roles: [Role.ADMIN]
  },

  // Profile - ADMIN
  {
    label: 'Profile',
    icon: 'person',
    route: '/dashboard/profile',
    roles: [Role.ADMIN]
  },

  // Divider
  {
    label: '',
    icon: '',
    divider: true
  },

  // Header for Pages
  {
    label: '',
    icon: '',
    header: 'Pages'
  },

  // Back to Website - ADMIN
  {
    label: 'Back to Website',
    icon: 'home',
    route: '/',
    roles: [Role.ADMIN]
  }
];
