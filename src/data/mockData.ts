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
  district: string; // District sanitaire
  region?: string; // Région (pour scalabilité future)
  agent: string;
  statut_csu: "actif" | "en_attente" | "a_renouveler";
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
  type: "CPN1" | "CPN2" | "CPN3" | "CPN4" | "CPON";
  date: string;
  poids: number;
  tension: string;
  pb: number;
  imc: number;
  agent: string;
  structure: string;
  hemoglobine?: number;
  checklist_ok?: boolean;
  statut?: "realise" | "planifie" | "a_planifier";
  rappel_envoye?: boolean;
}

export interface VisiteCPoN {
  id: string;
  patient_id: string;
  type: "CPoN1" | "CPoN2";
  date_prevue: string;
  date_realisee?: string;
  statut: "realise" | "planifie" | "rappel_envoye";
  jours_postpartum: number;
}

export interface RisqueIA {
  id: string;
  patient_id: string;
  patient_nom: string;
  age: number;
  score: number;
  niveau: "rouge" | "orange" | "vert";
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
  statut: "alerte" | "en_route" | "admis" | "resolu";
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
  vaccin: "BCG" | "Polio0" | "Penta1" | "Penta2" | "Penta3";
  date_prevue: string;
  date_realisee?: string;
  statut: "realise" | "retard" | "prevu";
  structure: string;
}

export interface HealthAgent {
  id: string;
  nom: string;
  prenom: string;
  telephone: string;
  type: "sage_femme" | "agent_sante"; // Type d'agent
  structure: string;
  district: string;
  region?: string;
  statut: "enroule" | "en_attente" | "actif"; // Statut d'enrôlement
  date_enrolement: string;
  code_enrolement: string; // Code unique pour créer le compte
  lien_telecharger?: string; // Lien pour télécharger l'app mobile
  sms_envoye: boolean;
  date_sms_envoye?: string;
  compte_cree: boolean; // Compte créé via mobile?
  date_activation?: string;
}

// Générateur de noms sénégalais
const noms = ["Diop", "Ndiaye", "Sow", "Fall", "Mbaye", "Gueye", "Cissé", "Thiam", "Sy", "Ba", "Diallo", "Sarr", "Faye", "Diouf", "Kane", "Niang", "Seck", "Ndao", "Touré", "Dème"];
const prenoms = ["Fatou", "Aissatou", "Mariama", "Awa", "Khadija", "Mame", "Ami", "Seynabou", "Binta", "Ndèye", "Khady", "Aminata", "Rokhaya", "Coumba", "Astou", "Dieynaba", "Maimouna", "Yacine", "Fatoumata", "Adama"];

// Helper pour générer des dates
const generateDate = (daysAgo: number) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0];
};

const generateFutureDate = (daysAhead: number) => {
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);
  return date.toISOString().split('T')[0];
};

// Patients enrichis (50 patients)
export const mockPatients: Patient[] = [
  // Patients existants améliorés
  {
    id: "p1",
    nom: "Diop",
    prenom: "Fatou",
    age: 17,
    telephone: "+221771234567",
    ddr: generateDate(224),
    terme_prevu: generateFutureDate(56),
    semaines: 32,
    structure: "Centre de Santé Pikine",
    district: "Pikine",
    region: "Dakar",
    agent: "Aminata Sall",
    statut_csu: "actif",
    date_enrolement: generateDate(210),
    date_renouvellement: generateFutureDate(155),
    qr_code: "QR_CSU_001",
    plan_naissance: "Hôpital Principal Dakar",
    imc: 20.5,
    pb_muac: 20.5,
    prise_ponderale: 8,
    hemoglobine: 11,
  },
  {
    id: "p2",
    nom: "Ndiaye",
    prenom: "Aissatou",
    age: 28,
    telephone: "+221772345678",
    ddr: generateDate(189),
    terme_prevu: generateFutureDate(91),
    semaines: 27,
    structure: "Centre de Santé Pikine",
    district: "Pikine",
    region: "Dakar",
    agent: "Khady Faye",
    statut_csu: "actif",
    date_enrolement: generateDate(175),
    date_renouvellement: generateFutureDate(190),
    qr_code: "QR_CSU_002",
  },
  {
    id: "p3",
    nom: "Sow",
    prenom: "Mariama",
    age: 35,
    telephone: "+221773456789",
    ddr: generateDate(259),
    terme_prevu: generateFutureDate(21),
    semaines: 37,
    structure: "Poste de Santé Dakar Nord",
    district: "Dakar Nord",
    region: "Dakar",
    agent: "Bineta Diallo",
    statut_csu: "a_renouveler",
    date_enrolement: generateDate(545),
    date_renouvellement: generateDate(180),
    qr_code: "QR_CSU_003",
  },
  {
    id: "p4",
    nom: "Fall",
    prenom: "Awa",
    age: 22,
    telephone: "+221774567890",
    ddr: generateDate(175),
    terme_prevu: generateFutureDate(105),
    semaines: 25,
    structure: "Poste de Santé Dakar Nord",
    district: "Dakar Nord",
    region: "Dakar",
    agent: "Fatou Sarr",
    statut_csu: "en_attente",
    date_enrolement: generateDate(145),
    qr_code: "QR_CSU_004",
  },
  {
    id: "p5",
    nom: "Mbaye",
    prenom: "Khadija",
    age: 19,
    telephone: "+221775678901",
    ddr: generateDate(196),
    terme_prevu: generateFutureDate(84),
    semaines: 28,
    structure: "Centre de Santé Thiaroye",
    district: "Dakar Sud",
    region: "Dakar",
    agent: "Aminata Sall",
    statut_csu: "actif",
    date_enrolement: generateDate(165),
    date_renouvellement: generateFutureDate(200),
    qr_code: "QR_CSU_005",
  },
  {
    id: "p6",
    nom: "Gueye",
    prenom: "Mame",
    age: 31,
    telephone: "+221776789012",
    ddr: generateDate(217),
    terme_prevu: generateFutureDate(63),
    semaines: 31,
    structure: "Poste de Santé Dakar Nord",
    district: "Dakar Nord",
    region: "Dakar",
    agent: "Khady Faye",
    statut_csu: "actif",
    date_enrolement: generateDate(203),
    date_renouvellement: generateFutureDate(162),
    qr_code: "QR_CSU_006",
  },
  {
    id: "p7",
    nom: "Cissé",
    prenom: "Ami",
    age: 26,
    telephone: "+221777890123",
    ddr: generateDate(161),
    terme_prevu: generateFutureDate(119),
    semaines: 23,
    structure: "Centre de Santé Pikine",
    district: "Pikine",
    region: "Dakar",
    agent: "Bineta Diallo",
    statut_csu: "actif",
    date_enrolement: generateDate(130),
    date_renouvellement: generateFutureDate(235),
    qr_code: "QR_CSU_007",
  },
  {
    id: "p8",
    nom: "Thiam",
    prenom: "Seynabou",
    age: 18,
    telephone: "+221778901234",
    ddr: generateDate(245),
    terme_prevu: generateFutureDate(35),
    semaines: 35,
    structure: "Hôpital Rufisque",
    district: "Rufisque",
    region: "Dakar",
    agent: "Fatou Sarr",
    statut_csu: "a_renouveler",
    date_enrolement: generateDate(490),
    date_renouvellement: generateDate(125),
    qr_code: "QR_CSU_008",
  },
  // Nouveaux patients (p9-p50)
  ...Array.from({ length: 42 }, (_, i) => {
    const id = `p${i + 9}`;
    const nomIndex = Math.floor(Math.random() * noms.length);
    const prenomIndex = Math.floor(Math.random() * prenoms.length);
    const age = 16 + Math.floor(Math.random() * 28); // 16-43 ans
    const semaines = 8 + Math.floor(Math.random() * 32); // 8-39 semaines
    const daysPregnant = semaines * 7;
    const daysUntilTerm = (40 - semaines) * 7;
    
    const structures = [
      { name: "Centre de Santé Pikine", district: "Pikine", region: "Dakar" },
      { name: "Poste de Santé Dakar Nord", district: "Dakar Nord", region: "Dakar" },
      { name: "Centre de Santé Thiaroye", district: "Dakar Sud", region: "Dakar" },
      { name: "Hôpital Rufisque", district: "Rufisque", region: "Dakar" },
      { name: "Poste de Santé Guédiawaye", district: "Guédiawaye", region: "Dakar" },
      { name: "Hôpital Principal Dakar", district: "Dakar Nord", region: "Dakar" },
      { name: "Hôpital Le Dantec", district: "Dakar Nord", region: "Dakar" },
      { name: "Hôpital Abass Ndao", district: "Dakar Sud", region: "Dakar" },
    ];
    const structure = structures[Math.floor(Math.random() * structures.length)];
    const agents = ["Aminata Sall", "Khady Faye", "Bineta Diallo", "Fatou Sarr", "Awa Ndiaye", "Mariama Cissé"];
    const statuts: ("actif" | "en_attente" | "a_renouveler")[] = ["actif", "actif", "actif", "en_attente", "a_renouveler"];
    
    return {
      id,
      nom: noms[nomIndex],
      prenom: prenoms[prenomIndex],
      age,
      telephone: `+22177${String(8900000 + i + 200).padStart(7, '0')}`,
      ddr: generateDate(daysPregnant),
      terme_prevu: generateFutureDate(daysUntilTerm),
      semaines,
      structure: structure.name,
      district: structure.district,
      region: structure.region,
      agent: agents[Math.floor(Math.random() * agents.length)],
      statut_csu: statuts[Math.floor(Math.random() * statuts.length)],
      date_enrolement: generateDate(daysPregnant - 14),
      date_renouvellement: generateFutureDate(daysUntilTerm + 30 + Math.floor(Math.random() * 150)),
      qr_code: `QR_CSU_${String(i + 9).padStart(3, '0')}`,
      imc: 18 + Math.random() * 12,
      pb_muac: 19 + Math.random() * 8,
      hemoglobine: age < 20 ? 9.5 + Math.random() * 3 : 10.5 + Math.random() * 3,
    } as Patient;
  }),
];

// Visites enrichies (générer des visites pour tous les patients)
export const mockVisites: Visite[] = [
  ...mockPatients.flatMap((patient) => {
    const visites: Visite[] = [];
    const stages: ("CPN1" | "CPN2" | "CPN3" | "CPN4")[] = ["CPN1", "CPN2", "CPN3", "CPN4"];
    const weeksForStage = [12, 20, 28, 36];
    
    stages.forEach((type, index) => {
      if (patient.semaines >= weeksForStage[index]) {
        const daysAgo = (patient.semaines - weeksForStage[index]) * 7 + Math.floor(Math.random() * 10);
        visites.push({
          id: `v${patient.id}_${type}`,
          patient_id: patient.id,
          type,
          date: generateDate(daysAgo),
          poids: 50 + Math.random() * 25 + index * 3,
          tension: `${110 + Math.floor(Math.random() * 20)}/${70 + Math.floor(Math.random() * 15)}`,
          pb: 20 + Math.random() * 7,
          imc: patient.imc || 20 + Math.random() * 8,
          agent: patient.agent,
          structure: patient.structure,
          hemoglobine: patient.hemoglobine || 10 + Math.random() * 3,
          checklist_ok: Math.random() > 0.1,
          statut: "realise",
        });
      } else if (patient.semaines >= weeksForStage[index] - 2) {
        // Visite planifiée pour bientôt
        visites.push({
          id: `v${patient.id}_${type}_plan`,
          patient_id: patient.id,
          type,
          date: generateFutureDate((weeksForStage[index] - patient.semaines) * 7),
          poids: 0,
          tension: "",
          pb: 0,
          imc: 0,
          agent: patient.agent,
          structure: patient.structure,
          statut: "planifie",
          rappel_envoye: Math.random() > 0.5,
        });
      }
    });
    
    return visites;
  }),
];

// Visites CPoN enrichies
export const mockVisitesCPoN: VisiteCPoN[] = [
  ...mockPatients
    .filter((p) => p.semaines > 38)
    .slice(0, 15)
    .flatMap((patient) => {
      const birthDate = new Date(patient.terme_prevu);
      const cpon1Date = new Date(birthDate);
      cpon1Date.setDate(cpon1Date.getDate() + 6);
      const cpon2Date = new Date(birthDate);
      cpon2Date.setDate(cpon2Date.getDate() + 42);
      
      return [
        {
          id: `cpon1_${patient.id}`,
          patient_id: patient.id,
          type: "CPoN1" as const,
          date_prevue: cpon1Date.toISOString().split('T')[0],
          statut: Math.random() > 0.5 ? ("realise" as const) : ("planifie" as const),
          jours_postpartum: 6,
        },
        {
          id: `cpon2_${patient.id}`,
          patient_id: patient.id,
          type: "CPoN2" as const,
          date_prevue: cpon2Date.toISOString().split('T')[0],
          statut: Math.random() > 0.7 ? ("realise" as const) : ("rappel_envoye" as const),
          jours_postpartum: 42,
        },
      ];
    }),
];

// Risques IA enrichis
export const mockRisquesIA: RisqueIA[] = [
  ...mockPatients.map((patient, index) => {
    let niveau: "rouge" | "orange" | "vert";
    let score: number;
    let facteurs: string[] = [];
    
    // Critères de risque
    if (patient.age < 18) {
      facteurs.push("Âge < 18");
      score = 70 + Math.random() * 20;
    } else if (patient.age > 35) {
      facteurs.push("Âge > 35");
      score = 50 + Math.random() * 20;
    } else {
      score = 10 + Math.random() * 30;
    }
    
    if (patient.hemoglobine && patient.hemoglobine < 11) {
      facteurs.push(`Anémie (Hb ${patient.hemoglobine.toFixed(1)})`);
      score += 15;
    }
    
    if (patient.pb_muac && patient.pb_muac < 21) {
      facteurs.push(`PB < 21cm (${patient.pb_muac.toFixed(1)})`);
      score += 20;
    }
    
    if (patient.semaines > 36 && patient.age < 19) {
      facteurs.push("Primipare proche du terme");
      score += 10;
    }
    
    // Déterminer le niveau
    if (score >= 70) {
      niveau = "rouge";
    } else if (score >= 40) {
      niveau = "orange";
    } else {
      niveau = "vert";
    }
    
    return {
      id: `r${patient.id}`,
      patient_id: patient.id,
      patient_nom: `${patient.prenom} ${patient.nom}`,
      age: patient.age,
      score: Math.round(score),
      niveau,
      facteurs,
      regle_ia: `Règle #${Math.floor(Math.random() * 25) + 1}`,
      prediction: niveau === "rouge" ? "Risque élevé - surveillance renforcée" : niveau === "orange" ? "Surveillance renforcée recommandée" : undefined,
      date: generateDate(Math.floor(Math.random() * 7)),
      semaines: patient.semaines,
    };
  }),
];

// Références SONU enrichies
export const mockReferencesSonu: ReferenceSonu[] = [
  ...mockPatients
    .filter((p) => p.age < 20 || p.age > 35 || p.semaines > 36)
    .slice(0, 20)
    .map((patient, index) => {
      const hoursAgo = Math.floor(Math.random() * 72);
      const alerteDate = new Date();
      alerteDate.setHours(alerteDate.getHours() - hoursAgo);
      
      const transportDelay = 20 + Math.floor(Math.random() * 90);
      const transportDate = new Date(alerteDate);
      transportDate.setMinutes(transportDate.getMinutes() + transportDelay);
      
      const admissionDelay = 15 + Math.floor(Math.random() * 60);
      const admissionDate = new Date(transportDate);
      admissionDate.setMinutes(admissionDate.getMinutes() + admissionDelay);
      
      const statuts: ("alerte" | "en_route" | "admis" | "resolu")[] = ["alerte", "en_route", "admis", "resolu"];
      const statut = statuts[Math.min(Math.floor(hoursAgo / 12), 3)];
      
      const alertes = [
        "HTA sévère + céphalées",
        "Rupture prématurée membranes",
        "Hémorragie vaginale",
        "Travail prématuré",
        "Éclampsie",
        "Souffrance fœtale",
        "Présentation anormale",
      ];
      
      const sonuStructures = [
        "Hôpital Principal Dakar",
        "Hôpital Le Dantec",
        "Hôpital Abass Ndao",
      ];
      
      return {
        id: `s${patient.id}`,
        patient_id: patient.id,
        patient_nom: `${patient.prenom} ${patient.nom}`,
        alerte_heure: alerteDate.toISOString(),
        transport_heure: statut !== "alerte" ? transportDate.toISOString() : undefined,
        admission_heure: (statut === "admis" || statut === "resolu") ? admissionDate.toISOString() : undefined,
        contre_ref_heure: statut === "resolu" ? new Date(admissionDate.getTime() + 1000 * 60 * (120 + Math.random() * 180)).toISOString() : undefined,
        statut,
        type_alerte: alertes[Math.floor(Math.random() * alertes.length)],
        structure_origine: patient.structure,
        structure_sonu: sonuStructures[Math.floor(Math.random() * sonuStructures.length)],
        delai_minutes: (statut === "admis" || statut === "resolu") ? transportDelay + admissionDelay : undefined,
      };
    }),
];

// KPI Data enrichies
export const mockKPIData: KPIData = {
  patientes_totales: mockPatients.length,
  cpn1_realisees: mockVisites.filter((v) => v.type === "CPN1" && v.statut === "realise").length,
  cpn1_cible: mockPatients.length,
  cpn4_realisees: mockVisites.filter((v) => v.type === "CPN4" && v.statut === "realise").length,
  cpn4_cible: Math.floor(mockPatients.length * 0.76),
  cpon_pourcentage: 68.5,
  risques_rouge: mockRisquesIA.filter((r) => r.niveau === "rouge").length,
  risques_orange: mockRisquesIA.filter((r) => r.niveau === "orange").length,
  risques_vert: mockRisquesIA.filter((r) => r.niveau === "vert").length,
  references_delai_moyen: Math.round(
    mockReferencesSonu.reduce((sum, r) => sum + (r.delai_minutes || 0), 0) /
      mockReferencesSonu.filter((r) => r.delai_minutes).length
  ),
  csu_enrolled: mockPatients.length,
  csu_actifs: mockPatients.filter((p) => p.statut_csu === "actif").length,
  csu_a_renouveler: mockPatients.filter((p) => p.statut_csu === "a_renouveler").length,
  pev_complet_pourcentage: 87.3,
  letalite_taux: 2.4,
  qualite_score: 78,
};

// Vaccins enrichis
export const mockVaccins: VaccinData[] = [
  ...mockPatients
    .filter((p) => p.semaines > 30)
    .flatMap((patient) => {
      const vaccines: ("BCG" | "Polio0" | "Penta1" | "Penta2" | "Penta3")[] = ["BCG", "Polio0", "Penta1", "Penta2", "Penta3"];
      const daysAfterBirth = [0, 0, 42, 70, 98];
      
      return vaccines.map((vaccin, index) => {
        const birthDate = new Date(patient.terme_prevu);
        const vaccinDate = new Date(birthDate);
        vaccinDate.setDate(vaccinDate.getDate() + daysAfterBirth[index]);
        
        const now = new Date();
        let statut: "realise" | "retard" | "prevu";
        let date_realisee: string | undefined;
        
        if (vaccinDate < now) {
          const daysPastDue = Math.floor((now.getTime() - vaccinDate.getTime()) / (1000 * 60 * 60 * 24));
          if (daysPastDue > 14) {
            statut = "retard";
          } else if (Math.random() > 0.3) {
            statut = "realise";
            date_realisee = new Date(vaccinDate.getTime() + Math.random() * daysPastDue * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
          } else {
            statut = "retard";
          }
        } else {
          statut = "prevu";
        }
        
        return {
          id: `vac_${patient.id}_${vaccin}`,
          patient_id: patient.id,
          vaccin,
          date_prevue: vaccinDate.toISOString().split('T')[0],
          date_realisee,
          statut,
          structure: patient.structure,
        };
      });
    }),
];

// Structures sanitaires
export const mockStructures = [
  "Poste de Santé Dakar Nord",
  "Centre de Santé Pikine",
  "Hôpital Rufisque",
  "Poste de Santé Guédiawaye",
  "Centre de Santé Thiaroye",
  "Hôpital Principal Dakar",
  "Hôpital Le Dantec",
  "Hôpital Abass Ndao",
];

// Districts
export const mockDistricts = [
  "Dakar Nord",
  "Dakar Sud",
  "Pikine",
  "Guédiawaye",
  "Rufisque",
  "Thiès",
  "Mbour",
  "Kaolack",
];

// Agents
export const mockAgents = [
  "Aminata Sall",
  "Khady Faye",
  "Bineta Diallo",
  "Fatou Sarr",
  "Awa Ndiaye",
  "Mariama Cissé",
  "Seynabou Thiam",
  "Aissatou Fall",
];

// User roles and permissions
export type UserRole =
  | "sage_femme"
  | "responsable_structure"
  | "responsable_district"
  | "partenaire_ong"
  | "partenaire_regional"
  | "partenaire_gouvernemental";

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
    structure: "Poste de Santé Dakar Nord",
  },
  {
    id: "U002",
    nom: "Diop",
    prenom: "Mariama",
    email: "mariama.diop@sante.sn",
    telephone: "+221702345678",
    role: "responsable_structure",
    structure: "Centre de Santé Pikine",
  },
  {
    id: "U003",
    nom: "Kane",
    prenom: "Ousmane",
    email: "ousmane.kane@sante.sn",
    telephone: "+221703456789",
    role: "responsable_district",
    district: "District Dakar",
  },
  {
    id: "U004",
    nom: "Ndiaye",
    prenom: "Fatou",
    email: "fatou.ndiaye@ong.org",
    telephone: "+221704567890",
    role: "partenaire_ong",
    region: "Dakar",
  },
  {
    id: "U005",
    nom: "Mbaye",
    prenom: "Ibrahima",
    email: "ibrahima.mbaye@msante.gouv.sn",
    telephone: "+221705678901",
    role: "partenaire_regional",
    region: "Dakar",
  },
  {
    id: "U006",
    nom: "Sy",
    prenom: "Aissatou",
    email: "aissatou.sy@msante.gouv.sn",
    telephone: "+221706789012",
    role: "partenaire_gouvernemental",
  },
];

// Qualité données
export const mockQualiteData = {
  completude: 92,
  coherence: 85,
  opportunite: 71,
  sync: 88,
  alertes: [
    { type: "DDR > date visite", count: 3, severity: "high" },
    { type: "Âge manquant", count: 7, severity: "medium" },
    { type: "Tension invalide", count: 2, severity: "high" },
    { type: "PB non renseigné", count: 12, severity: "low" },
  ],
};

// RDV en retard enrichis
export const mockRdvRetards = [
  ...mockPatients
    .filter((p) => {
      const visites = mockVisites.filter((v) => v.patient_id === p.id && v.statut === "realise");
      const lastVisite = visites[visites.length - 1];
      if (!lastVisite) return false;
      
      const daysSinceLastVisit = Math.floor((new Date().getTime() - new Date(lastVisite.date).getTime()) / (1000 * 60 * 60 * 24));
      return daysSinceLastVisit > 3 && p.semaines < 38;
    })
    .slice(0, 25)
    .map((patient) => {
      const visites = mockVisites.filter((v) => v.patient_id === patient.id && v.statut === "realise");
      const lastVisite = visites[visites.length - 1];
      const daysSinceLastVisit = Math.floor((new Date().getTime() - new Date(lastVisite.date).getTime()) / (1000 * 60 * 60 * 24));
      
      return {
        id: `rdv_${patient.id}`,
        patient_nom: `${patient.prenom} ${patient.nom}`,
        age: patient.age,
        semaines: patient.semaines,
        retard_jours: daysSinceLastVisit,
        agent: patient.agent,
        structure: patient.structure,
        telephone: patient.telephone,
      };
    }),
];

// Stats mensuelles CPN enrichies (pour graphiques)
export const mockCPNMonthly = [
  { mois: "Jan 2025", cpn1: 128, cpn2: 115, cpn3: 98, cpn4: 82 },
  { mois: "Fév 2025", cpn1: 142, cpn2: 125, cpn3: 108, cpn4: 91 },
  { mois: "Mar 2025", cpn1: 155, cpn2: 138, cpn3: 118, cpn4: 98 },
  { mois: "Avr 2025", cpn1: 168, cpn2: 152, cpn3: 132, cpn4: 112 },
  { mois: "Mai 2025", cpn1: 178, cpn2: 162, cpn3: 145, cpn4: 122 },
  { mois: "Jun 2025", cpn1: 185, cpn2: 172, cpn3: 155, cpn4: 131 },
  { mois: "Jul 2025", cpn1: 192, cpn2: 181, cpn3: 165, cpn4: 138 },
  { mois: "Aoû 2025", cpn1: 205, cpn2: 195, cpn3: 175, cpn4: 145 },
  { mois: "Sep 2025", cpn1: 218, cpn2: 205, cpn3: 188, cpn4: 155 },
  { mois: "Oct 2025", cpn1: 232, cpn2: 218, cpn3: 198, cpn4: 165 },
  { mois: "Nov 2025", cpn1: 245, cpn2: 230, cpn3: 208, cpn4: 172 },
];

// Couverture géographique (heatmap)
export const mockCouvertureGeo = [
  {
    structure: "Poste de Santé Dakar Nord",
    district: "Dakar Nord",
    patientes: 45,
    cpn1: 42,
    cible_cpn1: 45,
    couverture: 92.5,
    cpn4: 32,
  },
  {
    structure: "Centre de Santé Pikine",
    district: "Pikine",
    patientes: 67,
    cpn1: 60,
    cible_cpn1: 67,
    couverture: 85.7,
    cpn4: 52,
  },
  {
    structure: "Hôpital Rufisque",
    district: "Rufisque",
    patientes: 52,
    cpn1: 48,
    cible_cpn1: 52,
    couverture: 79.8,
    cpn4: 38,
  },
  {
    structure: "Poste de Santé Guédiawaye",
    district: "Guédiawaye",
    patientes: 38,
    cpn1: 32,
    cible_cpn1: 38,
    couverture: 81.2,
    cpn4: 25,
  },
  {
    structure: "Centre de Santé Thiaroye",
    district: "Dakar Sud",
    patientes: 41,
    cpn1: 38,
    cible_cpn1: 41,
    couverture: 88.3,
    cpn4: 30,
  },
  {
    structure: "Hôpital Principal Dakar",
    district: "Dakar Nord",
    patientes: 88,
    cpn1: 84,
    cible_cpn1: 88,
    couverture: 92.5,
    cpn4: 70,
  },
  {
    structure: "Hôpital Le Dantec",
    district: "Dakar Nord",
    patientes: 73,
    cpn1: 69,
    cible_cpn1: 73,
    couverture: 90.1,
    cpn4: 58,
  },
  {
    structure: "Hôpital Abass Ndao",
    district: "Dakar Sud",
    patientes: 55,
    cpn1: 51,
    cible_cpn1: 55,
    couverture: 87.3,
    cpn4: 42,
  },
];

// Agents de santé et sage-femmes
export const mockHealthAgents: HealthAgent[] = [
  {
    id: "HA001",
    nom: "Faye",
    prenom: "Khady",
    telephone: "+221771234500",
    type: "sage_femme",
    structure: "Centre de Santé Pikine",
    district: "Pikine",
    region: "Dakar",
    statut: "actif",
    date_enrolement: generateDate(30),
    code_enrolement: "SF2025001",
    lien_telecharger: "https://app.tekhe.sn/download/HA001",
    sms_envoye: true,
    date_sms_envoye: generateDate(30),
    compte_cree: true,
    date_activation: generateDate(28),
  },
  {
    id: "HA002",
    nom: "Diallo",
    prenom: "Bineta",
    telephone: "+221772345600",
    type: "sage_femme",
    structure: "Poste de Santé Dakar Nord",
    district: "Dakar Nord",
    region: "Dakar",
    statut: "actif",
    date_enrolement: generateDate(25),
    code_enrolement: "SF2025002",
    lien_telecharger: "https://app.tekhe.sn/download/HA002",
    sms_envoye: true,
    date_sms_envoye: generateDate(25),
    compte_cree: true,
    date_activation: generateDate(23),
  },
  {
    id: "HA003",
    nom: "Sarr",
    prenom: "Fatou",
    telephone: "+221773456700",
    type: "sage_femme",
    structure: "Hôpital Rufisque",
    district: "Rufisque",
    region: "Dakar",
    statut: "enroule",
    date_enrolement: generateDate(5),
    code_enrolement: "SF2025003",
    lien_telecharger: "https://app.tekhe.sn/download/HA003",
    sms_envoye: true,
    date_sms_envoye: generateDate(5),
    compte_cree: false,
  },
  {
    id: "HA004",
    nom: "Ba",
    prenom: "Aissatou",
    telephone: "+221774567800",
    type: "agent_sante",
    structure: "Centre de Santé Thiaroye",
    district: "Dakar Sud",
    region: "Dakar",
    statut: "enroule",
    date_enrolement: generateDate(2),
    code_enrolement: "AS2025001",
    lien_telecharger: "https://app.tekhe.sn/download/HA004",
    sms_envoye: true,
    date_sms_envoye: generateDate(2),
    compte_cree: false,
  },
  {
    id: "HA005",
    nom: "Ndiaye",
    prenom: "Awa",
    telephone: "+221775678900",
    type: "agent_sante",
    structure: "Poste de Santé Guédiawaye",
    district: "Guédiawaye",
    region: "Dakar",
    statut: "en_attente",
    date_enrolement: generateDate(0),
    code_enrolement: "AS2025002",
    lien_telecharger: "https://app.tekhe.sn/download/HA005",
    sms_envoye: false,
  },
];
