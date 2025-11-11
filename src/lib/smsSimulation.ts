import { HealthAgent } from "@/data/mockData";

export interface SMSRecord {
  id: string;
  telephone: string;
  agent_nom: string;
  agent_prenom: string;
  contenu: string;
  code_enrolement: string;
  lien_telecharger: string;
  statut: "envoye" | "en_attente";
  date_envoi: string;
  timestamp: number;
}

// Simulation d'une base de données d'SMS envoyés (localStorage)
const SMS_STORAGE_KEY = "tekhe_sms_history";

export function generateEnrollmentSMS(agent: HealthAgent): string {
  return `Bienvenue sur TEKHE Care! 
Lien app: ${agent.lien_telecharger}
Code: ${agent.code_enrolement}
Créez votre compte avec votre téléphone.`;
}

export function sendEnrollmentSMS(agent: HealthAgent): SMSRecord {
  const smsRecord: SMSRecord = {
    id: `SMS_${Date.now()}`,
    telephone: agent.telephone,
    agent_nom: agent.nom,
    agent_prenom: agent.prenom,
    contenu: generateEnrollmentSMS(agent),
    code_enrolement: agent.code_enrolement,
    lien_telecharger: agent.lien_telecharger || "",
    statut: "envoye",
    date_envoi: new Date().toISOString().split("T")[0],
    timestamp: Date.now(),
  };

  // Sauvegarder dans localStorage (simulation)
  const existingSMS = getSMSHistory();
  existingSMS.push(smsRecord);
  localStorage.setItem(SMS_STORAGE_KEY, JSON.stringify(existingSMS));

  // Simuler l'envoi avec un delai
  console.log(`📱 SMS SIMULÉ envoyé à ${agent.telephone}:`);
  console.log(`   ${smsRecord.contenu}`);

  return smsRecord;
}

export function getSMSHistory(): SMSRecord[] {
  try {
    const data = localStorage.getItem(SMS_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function getSMSHistoryForAgent(telephone: string): SMSRecord[] {
  return getSMSHistory().filter((sms) => sms.telephone === telephone);
}

export function clearSMSHistory(): void {
  localStorage.removeItem(SMS_STORAGE_KEY);
}

export function getSMSStats() {
  const history = getSMSHistory();
  return {
    total: history.length,
    envoyes: history.filter((s) => s.statut === "envoye").length,
    en_attente: history.filter((s) => s.statut === "en_attente").length,
  };
}
