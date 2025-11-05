// Mock data for TEKHE Dashboard

export interface Patient {
  id: string;
  nom: string;
  prenom: string;
  age: number;
  telephone: string;
  ddr: string;
  terme_prevu: string;
  semaines: number;
  structure: string;
  agent: string;
  statut_csu: 'actif' | 'en_attente' | 'a_renouveler';
  photo_piece?: string;
  qr_code?: string;
  date_enrolement?: string;
  date_renouvellement?: string;
  plan_naissance?: string;
  imc?: number;
  pb_muac?: number;
  prise_ponderale?: number;
  hemoglobine?: number;
}

export interface Visite {
  id: string;
  patient_id: string;
  type: 'CPN1' | 'CPN2' | 'CPN3' | 'CPN4' | 'CPON';
  date: string;
  poids: number;
  tension: string;
  pb: number;
  imc: number;
  agent: string;
  structure: string;
  hemoglobine?: number;
  checklist_ok?: boolean;
  statut?: 'realise' | 'planifie' | 'a_planifier';
  rappel_envoye?: boolean;
}

export interface VisiteCPoN {
  id: string;
  patient_id: string;
  type: 'CPoN1' | 'CPoN2';
  date_prevue: string;
  date_realisee?: string;
  statut: 'realise' | 'planifie' | 'rappel_envoye';
  jours_postpartum: number;
}

export interface RisqueIA {
  id: string;
  patient_id: string;
  patient_nom: string;
  age: number;
  score: number;
  niveau: 'rouge' | 'orange' | 'vert';
  facteurs: string[];
  regle_ia: string;
  prediction?: string;
  date: string;
  semaines: number;
}

export interface ReferenceSonu {
  id: string;
  patient_id: string;
  patient_nom: string;
  alerte_heure: string;
  transport_heure?: string;
  admission_heure?: string;
  contre_ref_heure?: string;
  statut: 'alerte' | 'en_route' | 'admis' | 'resolu';
  type_alerte: string;
  structure_origine: string;
  structure_sonu: string;
  delai_minutes?: number;
}

export interface KPIData {
  patientes_totales: number;
  cpn1_realisees: number;
  cpn1_cible: number;
  cpn4_realisees: number;
  cpn4_cible: number;
  cpon_pourcentage: number;
  risques_rouge: number;
  risques_orange: number;
  risques_vert: number;
  references_delai_moyen: number;
  csu_enrolled: number;
  csu_actifs: number;
  csu_a_renouveler: number;
  pev_complet_pourcentage: number;
  letalite_taux: number;
  qualite_score: number;
}

export interface VaccinData {
  id: string;
  patient_id: string;
  vaccin: 'BCG' | 'Polio0' | 'Penta1' | 'Penta2' | 'Penta3';
  date_prevue: string;
  date_realisee?: string;
  statut: 'realise' | 'retard' | 'prevu';
  structure: string;
}

// Patients
export const mockPatients: Patient[] = [
  {
    id: 'p1',
    nom: 'Diop',
    prenom: 'Fatou',
    age: 17,
    telephone: '+221771234567',
    ddr: '2025-03-15',
    terme_prevu: '2025-12-20',
    semaines: 32,
    structure: 'Poste de Santé Dakar Nord',
    agent: 'Aminata Sall',
    statut_csu: 'actif',
    date_enrolement: '2025-04-01',
    date_renouvellement: '2026-04-01',
    qr_code: 'QR_CSU_001',
    plan_naissance: 'Hôpital Principal Dakar',
    imc: 20.5,
    pb_muac: 20.5,
    prise_ponderale: 8,
    hemoglobine: 11
  },
  {
    id: 'p2',
    nom: 'Ndiaye',
    prenom: 'Aissatou',
    age: 28,
    telephone: '+221772345678',
    ddr: '2025-04-20',
    terme_prevu: '2026-01-25',
    semaines: 27,
    structure: 'Centre de Santé Pikine',
    agent: 'Khady Faye',
    statut_csu: 'actif',
    date_enrolement: '2025-05-10',
    date_renouvellement: '2026-05-10',
    qr_code: 'QR_CSU_002'
  },
  {
    id: 'p3',
    nom: 'Sow',
    prenom: 'Mariama',
    age: 35,
    telephone: '+221773456789',
    ddr: '2025-02-10',
    terme_prevu: '2025-11-15',
    semaines: 37,
    structure: 'Hôpital Rufisque',
    agent: 'Bineta Diallo',
    statut_csu: 'a_renouveler',
    date_enrolement: '2024-03-01',
    date_renouvellement: '2025-11-30',
    qr_code: 'QR_CSU_003'
  },
  {
    id: 'p4',
    nom: 'Fall',
    prenom: 'Awa',
    age: 22,
    telephone: '+221774567890',
    ddr: '2025-05-01',
    terme_prevu: '2026-02-05',
    semaines: 25,
    structure: 'Poste de Santé Guédiawaye',
    agent: 'Fatou Sarr',
    statut_csu: 'en_attente',
    date_enrolement: '2025-06-01',
    qr_code: 'QR_CSU_004'
  },
  {
    id: 'p5',
    nom: 'Mbaye',
    prenom: 'Khadija',
    age: 19,
    telephone: '+221775678901',
    ddr: '2025-04-05',
    terme_prevu: '2026-01-10',
    semaines: 28,
    structure: 'Centre de Santé Thiaroye',
    agent: 'Aminata Sall',
    statut_csu: 'actif',
    date_enrolement: '2025-05-01',
    date_renouvellement: '2026-05-01',
    qr_code: 'QR_CSU_005'
  },
  {
    id: 'p6',
    nom: 'Gueye',
    prenom: 'Mame',
    age: 31,
    telephone: '+221776789012',
    ddr: '2025-03-20',
    terme_prevu: '2025-12-25',
    semaines: 31,
    structure: 'Poste de Santé Dakar Nord',
    agent: 'Khady Faye',
    statut_csu: 'actif',
    date_enrolement: '2025-04-15',
    date_renouvellement: '2026-04-15',
    qr_code: 'QR_CSU_006'
  },
  {
    id: 'p7',
    nom: 'Cissé',
    prenom: 'Ami',
    age: 26,
    telephone: '+221777890123',
    ddr: '2025-05-15',
    terme_prevu: '2026-02-19',
    semaines: 23,
    structure: 'Centre de Santé Pikine',
    agent: 'Bineta Diallo',
    statut_csu: 'actif',
    date_enrolement: '2025-06-10',
    date_renouvellement: '2026-06-10',
    qr_code: 'QR_CSU_007'
  },
  {
    id: 'p8',
    nom: 'Thiam',
    prenom: 'Seynabou',
    age: 18,
    telephone: '+221778901234',
    ddr: '2025-02-28',
    terme_prevu: '2025-12-03',
    semaines: 35,
    structure: 'Hôpital Rufisque',
    agent: 'Fatou Sarr',
    statut_csu: 'a_renouveler',
    date_enrolement: '2024-04-01',
    date_renouvellement: '2025-12-01',
    qr_code: 'QR_CSU_008'
  }
];

// Visites
export const mockVisites: Visite[] = [
  { id: 'v1', patient_id: 'p1', type: 'CPN1', date: '2025-04-10', poids: 52, tension: '110/70', pb: 20, imc: 20.5, agent: 'Aminata Sall', structure: 'Poste de Santé Dakar Nord', hemoglobine: 11, checklist_ok: true, statut: 'realise' },
  { id: 'v2', patient_id: 'p1', type: 'CPN2', date: '2025-07-15', poids: 58, tension: '120/80', pb: 20.5, imc: 21.8, agent: 'Aminata Sall', structure: 'Poste de Santé Dakar Nord', hemoglobine: 10.8, checklist_ok: true, statut: 'realise' },
  { id: 'v3', patient_id: 'p1', type: 'CPN3', date: '2025-10-20', poids: 60, tension: '125/85', pb: 20.5, imc: 22.5, agent: 'Aminata Sall', structure: 'Poste de Santé Dakar Nord', statut: 'planifie', rappel_envoye: true },
  { id: 'v4', patient_id: 'p2', type: 'CPN1', date: '2025-05-25', poids: 65, tension: '120/80', pb: 24, imc: 25.5, agent: 'Khady Faye', structure: 'Centre de Santé Pikine', hemoglobine: 12, checklist_ok: true, statut: 'realise' },
  { id: 'v5', patient_id: 'p2', type: 'CPN2', date: '2025-07-30', poids: 68, tension: '118/78', pb: 25, imc: 26.6, agent: 'Khady Faye', structure: 'Centre de Santé Pikine', hemoglobine: 11.5, checklist_ok: true, statut: 'realise' },
  { id: 'v6', patient_id: 'p3', type: 'CPN1', date: '2025-03-20', poids: 72, tension: '115/75', pb: 26, imc: 28.1, agent: 'Bineta Diallo', structure: 'Hôpital Rufisque', hemoglobine: 12.5, checklist_ok: true, statut: 'realise' },
  { id: 'v7', patient_id: 'p3', type: 'CPN2', date: '2025-05-25', poids: 76, tension: '118/77', pb: 26.5, imc: 29.6, agent: 'Bineta Diallo', structure: 'Hôpital Rufisque', hemoglobine: 12.2, checklist_ok: true, statut: 'realise' },
  { id: 'v8', patient_id: 'p3', type: 'CPN3', date: '2025-07-30', poids: 80, tension: '120/80', pb: 27, imc: 31.2, agent: 'Bineta Diallo', structure: 'Hôpital Rufisque', hemoglobine: 11.8, checklist_ok: true, statut: 'realise' },
  { id: 'v9', patient_id: 'p3', type: 'CPN4', date: '2025-09-15', poids: 84, tension: '122/82', pb: 27.5, imc: 32.8, agent: 'Bineta Diallo', structure: 'Hôpital Rufisque', hemoglobine: 11.5, checklist_ok: true, statut: 'realise' },
  { id: 'v10', patient_id: 'p4', type: 'CPN1', date: '2025-06-10', poids: 60, tension: '110/70', pb: 23, imc: 23.4, agent: 'Fatou Sarr', structure: 'Poste de Santé Guédiawaye', hemoglobine: 11.2, checklist_ok: true, statut: 'realise' },
];

// Visites CPoN
export const mockVisitesCPoN: VisiteCPoN[] = [
  { id: 'cpon1', patient_id: 'p1', type: 'CPoN1', date_prevue: '2025-12-26', statut: 'planifie', jours_postpartum: 6 },
  { id: 'cpon2', patient_id: 'p1', type: 'CPoN2', date_prevue: '2026-01-31', statut: 'rappel_envoye', jours_postpartum: 42 },
];

// Risques IA
export const mockRisquesIA: RisqueIA[] = [
  {
    id: 'r1',
    patient_id: 'p1',
    patient_nom: 'Fatou Diop',
    age: 17,
    score: 85,
    niveau: 'rouge',
    facteurs: ['Âge < 18', 'HTA (150/100)', 'PB < 21cm'],
    regle_ia: 'Règle #12',
    prediction: 'Risque éclampsie +72% dans 7 jours',
    date: '2025-10-28',
    semaines: 32
  },
  {
    id: 'r2',
    patient_id: 'p5',
    patient_nom: 'Khadija Mbaye',
    age: 19,
    score: 68,
    niveau: 'orange',
    facteurs: ['Âge < 20', 'Anémie (PB 20cm)', 'CPN2 retard 5j'],
    regle_ia: 'Règle #8',
    prediction: 'Surveillance renforcée anémie',
    date: '2025-10-27',
    semaines: 28
  },
  {
    id: 'r3',
    patient_id: 'p8',
    patient_nom: 'Seynabou Thiam',
    age: 18,
    score: 72,
    niveau: 'orange',
    facteurs: ['Âge < 19', 'Primipare', 'PB 19.5cm'],
    regle_ia: 'Règle #15',
    date: '2025-10-26',
    semaines: 35
  },
  {
    id: 'r4',
    patient_id: 'p2',
    patient_nom: 'Aissatou Ndiaye',
    age: 28,
    score: 25,
    niveau: 'vert',
    facteurs: [],
    regle_ia: 'Règle #1',
    date: '2025-10-28',
    semaines: 27
  },
  {
    id: 'r5',
    patient_id: 'p3',
    patient_nom: 'Mariama Sow',
    age: 35,
    score: 55,
    niveau: 'orange',
    facteurs: ['Âge > 35', 'Multipare (G4P3)'],
    regle_ia: 'Règle #18',
    date: '2025-10-25',
    semaines: 37
  }
];

// Références SONU
export const mockReferencesSonu: ReferenceSonu[] = [
  {
    id: 's1',
    patient_id: 'p1',
    patient_nom: 'Fatou Diop',
    alerte_heure: '2025-10-28T14:32:00',
    transport_heure: '2025-10-28T15:10:00',
    admission_heure: '2025-10-28T15:45:00',
    contre_ref_heure: '2025-10-28T18:00:00',
    statut: 'resolu',
    type_alerte: 'HTA sévère + céphalées',
    structure_origine: 'Poste de Santé Dakar Nord',
    structure_sonu: 'Hôpital Principal Dakar',
    delai_minutes: 193
  },
  {
    id: 's2',
    patient_id: 'p8',
    patient_nom: 'Seynabou Thiam',
    alerte_heure: '2025-10-27T09:15:00',
    transport_heure: '2025-10-27T09:45:00',
    admission_heure: '2025-10-27T10:20:00',
    statut: 'admis',
    type_alerte: 'Rupture prématurée membranes',
    structure_origine: 'Hôpital Rufisque',
    structure_sonu: 'Hôpital Le Dantec',
    delai_minutes: 65
  },
  {
    id: 's3',
    patient_id: 'p5',
    patient_nom: 'Khadija Mbaye',
    alerte_heure: '2025-10-26T16:50:00',
    transport_heure: '2025-10-26T17:30:00',
    statut: 'en_route',
    type_alerte: 'Hémorragie vaginale',
    structure_origine: 'Centre de Santé Thiaroye',
    structure_sonu: 'Hôpital Abass Ndao',
  },
  {
    id: 's4',
    patient_id: 'p3',
    patient_nom: 'Mariama Sow',
    alerte_heure: '2025-10-25T11:20:00',
    transport_heure: '2025-10-25T12:05:00',
    admission_heure: '2025-10-25T12:35:00',
    contre_ref_heure: '2025-10-25T16:45:00',
    statut: 'resolu',
    type_alerte: 'Travail prématuré',
    structure_origine: 'Hôpital Rufisque',
    structure_sonu: 'Hôpital Principal Dakar',
    delai_minutes: 75
  }
];

// KPI Data
export const mockKPIData: KPIData = {
  patientes_totales: 1248,
  cpn1_realisees: 1156,
  cpn1_cible: 1248,
  cpn4_realisees: 782,
  cpn4_cible: 950,
  cpon_pourcentage: 68.5,
  risques_rouge: 12,
  risques_orange: 48,
  risques_vert: 1188,
  references_delai_moyen: 112,
  csu_enrolled: 1248,
  csu_actifs: 1098,
  csu_a_renouveler: 89,
  pev_complet_pourcentage: 87.3,
  letalite_taux: 2.4,
  qualite_score: 78
};

// Vaccins
export const mockVaccins: VaccinData[] = [
  { id: 'vac1', patient_id: 'p1', vaccin: 'BCG', date_prevue: '2025-12-22', statut: 'prevu', structure: 'Poste de Santé Dakar Nord' },
  { id: 'vac2', patient_id: 'p2', vaccin: 'BCG', date_prevue: '2026-01-27', statut: 'prevu', structure: 'Centre de Santé Pikine' },
  { id: 'vac3', patient_id: 'p3', vaccin: 'BCG', date_prevue: '2025-11-17', statut: 'prevu', structure: 'Hôpital Rufisque' },
  { id: 'vac4', patient_id: 'p4', vaccin: 'BCG', date_prevue: '2026-02-07', statut: 'prevu', structure: 'Poste de Santé Guédiawaye' },
];

// Structures sanitaires
export const mockStructures = [
  'Poste de Santé Dakar Nord',
  'Centre de Santé Pikine',
  'Hôpital Rufisque',
  'Poste de Santé Guédiawaye',
  'Centre de Santé Thiaroye',
  'Hôpital Principal Dakar',
  'Hôpital Le Dantec',
  'Hôpital Abass Ndao'
];

// Districts
export const mockDistricts = [
  'Dakar Nord',
  'Dakar Sud',
  'Pikine',
  'Guédiawaye',
  'Rufisque',
  'Thiès',
  'Mbour',
  'Kaolack'
];

// Agents
export const mockAgents = [
  'Aminata Sall',
  'Khady Faye',
  'Bineta Diallo',
  'Fatou Sarr',
  'Awa Ndiaye',
  'Mariama Cissé',
  'Seynabou Thiam',
  'Aissatou Fall'
];

// User roles and permissions
export type UserRole = 'sage_femme' | 'responsable_structure' | 'responsable_district' | 'partenaire_ong' | 'partenaire_regional' | 'partenaire_gouvernemental';

export interface User {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  role: UserRole;
  structure?: string;
  district?: string;
  region?: string;
}

export const mockUsers: User[] = [
  {
    id: "U001",
    nom: "Sall",
    prenom: "Aminata",
    email: "aminata.sall@sante.sn",
    telephone: "+221701234567",
    role: "sage_femme",
    structure: "Poste de Santé Dakar Nord"
  },
  {
    id: "U002",
    nom: "Diop",
    prenom: "Mariama",
    email: "mariama.diop@sante.sn",
    telephone: "+221702345678",
    role: "responsable_structure",
    structure: "Centre de Santé Pikine"
  },
  {
    id: "U003",
    nom: "Kane",
    prenom: "Ousmane",
    email: "ousmane.kane@sante.sn",
    telephone: "+221703456789",
    role: "responsable_district",
    district: "District Dakar"
  },
  {
    id: "U004",
    nom: "Ndiaye",
    prenom: "Fatou",
    email: "fatou.ndiaye@ong.org",
    telephone: "+221704567890",
    role: "partenaire_ong",
    region: "Dakar"
  },
  {
    id: "U005",
    nom: "Mbaye",
    prenom: "Ibrahima",
    email: "ibrahima.mbaye@msante.gouv.sn",
    telephone: "+221705678901",
    role: "partenaire_regional",
    region: "Dakar"
  },
  {
    id: "U006",
    nom: "Sy",
    prenom: "Aissatou",
    email: "aissatou.sy@msante.gouv.sn",
    telephone: "+221706789012",
    role: "partenaire_gouvernemental"
  }
];

// Qualité données
export const mockQualiteData = {
  completude: 92,
  coherence: 85,
  opportunite: 71,
  sync: 88,
  alertes: [
    { type: 'DDR > date visite', count: 3, severity: 'high' },
    { type: 'Âge manquant', count: 7, severity: 'medium' },
    { type: 'Tension invalide', count: 2, severity: 'high' },
    { type: 'PB non renseigné', count: 12, severity: 'low' }
  ]
};

// RDV en retard
export const mockRdvRetards = [
  { id: 'rdv1', patient_nom: 'Fatou Diop', age: 17, semaines: 32, retard_jours: 5, agent: 'Aminata Sall', structure: 'Poste de Santé Dakar Nord', telephone: '+221771234567' },
  { id: 'rdv2', patient_nom: 'Khadija Mbaye', age: 19, semaines: 28, retard_jours: 4, agent: 'Aminata Sall', structure: 'Centre de Santé Thiaroye', telephone: '+221775678901' },
  { id: 'rdv3', patient_nom: 'Seynabou Thiam', age: 18, semaines: 35, retard_jours: 8, agent: 'Fatou Sarr', structure: 'Hôpital Rufisque', telephone: '+221778901234' },
];

// Stats mensuelles CPN (pour graphiques)
export const mockCPNMonthly = [
  { mois: 'Jan 2025', cpn1: 98, cpn2: 87, cpn3: 76, cpn4: 65 },
  { mois: 'Fév 2025', cpn1: 105, cpn2: 92, cpn3: 81, cpn4: 70 },
  { mois: 'Mar 2025', cpn1: 112, cpn2: 98, cpn3: 85, cpn4: 73 },
  { mois: 'Avr 2025', cpn1: 118, cpn2: 105, cpn3: 92, cpn4: 78 },
  { mois: 'Mai 2025', cpn1: 125, cpn2: 110, cpn3: 98, cpn4: 82 },
  { mois: 'Jun 2025', cpn1: 132, cpn2: 118, cpn3: 105, cpn4: 88 },
  { mois: 'Jul 2025', cpn1: 128, cpn2: 122, cpn3: 110, cpn4: 92 },
  { mois: 'Aoû 2025', cpn1: 135, cpn2: 128, cpn3: 115, cpn4: 95 },
  { mois: 'Sep 2025', cpn1: 142, cpn2: 132, cpn3: 120, cpn4: 98 },
  { mois: 'Oct 2025', cpn1: 148, cpn2: 138, cpn3: 125, cpn4: 102 },
];

// Couverture géographique (heatmap)
export const mockCouvertureGeo = [
  { structure: 'Poste de Santé Dakar Nord', district: 'Dakar Nord', patientes: 45, cpn1: 42, cible_cpn1: 45, couverture: 92.5, cpn4: 32 },
  { structure: 'Centre de Santé Pikine', district: 'Pikine', patientes: 67, cpn1: 60, cible_cpn1: 67, couverture: 85.7, cpn4: 52 },
  { structure: 'Hôpital Rufisque', district: 'Rufisque', patientes: 52, cpn1: 48, cible_cpn1: 52, couverture: 79.8, cpn4: 38 },
  { structure: 'Poste de Santé Guédiawaye', district: 'Guédiawaye', patientes: 38, cpn1: 32, cible_cpn1: 38, couverture: 81.2, cpn4: 25 },
  { structure: 'Centre de Santé Thiaroye', district: 'Dakar Sud', patientes: 41, cpn1: 38, cible_cpn1: 41, couverture: 88.3, cpn4: 30 },
  { structure: 'Hôpital Principal Dakar', district: 'Dakar Nord', patientes: 88, cpn1: 84, cible_cpn1: 88, couverture: 92.5, cpn4: 70 },
  { structure: 'Hôpital Le Dantec', district: 'Dakar Nord', patientes: 73, cpn1: 69, cible_cpn1: 73, couverture: 90.1, cpn4: 58 },
  { structure: 'Hôpital Abass Ndao', district: 'Dakar Sud', patientes: 55, cpn1: 51, cible_cpn1: 55, couverture: 87.3, cpn4: 42 },
];
