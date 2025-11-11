import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { HealthAgent } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { usePermissions } from "@/hooks/usePermissions";
import { Resource } from "@/lib/permissions";
import { CreateGuard } from "@/components/PermissionGuard";
import { toast } from "sonner";
import { sendEnrollmentSMS, getSMSHistoryForAgent, SMSRecord } from "@/lib/smsSimulation";
import { useAgents } from "@/hooks/useAgents";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Users,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Phone,
  Plus,
  Eye,
} from "lucide-react";
import { addAuditLog } from "@/lib/auditLog";
import { Action } from "@/lib/permissions";

export default function AgentEnrollment() {
  const { user } = useAuth();
  const { can } = usePermissions();
  const { agents, addAgent, loading } = useAgents();
  const [showEnrollDialog, setShowEnrollDialog] = useState(false);
  const [showSMSHistory, setShowSMSHistory] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<HealthAgent | null>(null);
  const [smsHistory, setSmsHistory] = useState<SMSRecord[]>([]);

  // Générer code d'enrôlement unique
  const generateEnrollmentCode = (): string => {
    const type = formData.type === "sage_femme" ? "SF" : "AS";
    const year = new Date().getFullYear().toString().slice(-2);
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${type}${year}${random}`;
  };

  // Filtrer les agents selon le rôle et la structure/district
  const filteredAgents = agents.filter((agent) => {
    if (user?.role === "responsable_structure") {
      return agent.structure === user.structure;
    } else if (user?.role === "responsable_district") {
      return agent.district === user.district;
    }
    return false;
  });

  // État du formulaire
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    telephone: "",
    type: "sage_femme" as "sage_femme" | "agent_sante",
  });

  const handleEnrollNewAgent = () => {
    if (!formData.nom || !formData.prenom || !formData.telephone) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    if (!/^\+221\d{9}$/.test(formData.telephone)) {
      toast.error("Format téléphone invalide (ex: +221701234567)");
      return;
    }

    // Vérifier si l'agent existe déjà
    if (filteredAgents.some((a) => a.telephone === formData.telephone)) {
      toast.error("Cet agent est déjà enrôlé");
      return;
    }

    const code = generateEnrollmentCode();
    const newAgent: HealthAgent = {
      id: `HA${Date.now()}`,
      nom: formData.nom,
      prenom: formData.prenom,
      telephone: formData.telephone,
      type: formData.type,
      structure: user?.structure || "",
      district: user?.district || "",
      region: user?.region,
      statut: "enroule",
      date_enrolement: new Date().toISOString().split("T")[0],
      code_enrolement: code,
      lien_telecharger: `https://app.tekhe.sn/download/${code}`,
      sms_envoye: false,
    };

    // Envoyer SMS
    try {
      sendEnrollmentSMS(newAgent);
      toast.success(`Agent enrôlé avec succès. SMS envoyé �� ${formData.telephone}`);

      // Log audit
      addAuditLog(
        user!,
        "create" as Action,
        "agent" as any,
        newAgent.id,
        {
          agent_nom: `${newAgent.prenom} ${newAgent.nom}`,
          type: newAgent.type,
          structure: newAgent.structure,
        },
        true
      );

      // Ajouter à la liste via Zustand store
      addAgent(newAgent);

      // Réinitialiser le formulaire
      setFormData({
        nom: "",
        prenom: "",
        telephone: "",
        type: "sage_femme",
      });
      setShowEnrollDialog(false);
    } catch (error) {
      toast.error("Erreur lors de l'enrôlement");
      console.error(error);
    }
  };

  const handleViewAgentDetail = (agent: HealthAgent) => {
    setSelectedAgent(agent);
    setShowDetailModal(true);
  };

  const handleResendSMS = (agent: HealthAgent) => {
    try {
      sendEnrollmentSMS(agent);
      toast.success(`SMS renvoyé à ${agent.telephone}`);

      addAuditLog(
        user!,
        "update" as Action,
        "agent" as any,
        agent.id,
        { action: "sms_resend", telephone: agent.telephone },
        true
      );

      agent.sms_envoye = true;
      agent.date_sms_envoye = new Date().toISOString().split("T")[0];
    } catch (error) {
      toast.error("Erreur lors du renvoi du SMS");
      console.error(error);
    }
  };

  const handleViewSMSHistory = (agent: HealthAgent) => {
    setSelectedAgent(agent);
    const history = getSMSHistoryForAgent(agent.telephone);
    setSmsHistory(history);
    setShowSMSHistory(true);
  };

  const handleCopySMS = (sms: SMSRecord) => {
    const text = `${sms.contenu}`;
    navigator.clipboard.writeText(text);
    toast.success("SMS copié dans le presse-papiers");
  };

  return (
    <div className="space-y-6 p-6">
      {/* Titre et Description */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-slate-900">Gestion Agents de Santé</h1>
        <p className="text-slate-600">
          Enrôlez et gérez les agents de santé et sage-femmes de votre structure
        </p>
      </div>

      {/* Statistiques */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Agents</CardTitle>
            <Users className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredAgents.length}</div>
            <p className="text-xs text-slate-600 mt-1">
              Agents dans votre {user?.role === "responsable_structure" ? "structure" : "district"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Comptes Créés</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredAgents.filter((a) => a.compte_cree).length}
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Agents ayant activé leur compte
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Attente</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredAgents.filter((a) => !a.compte_cree).length}
            </div>
            <p className="text-xs text-slate-600 mt-1">
              En attente de création de compte
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Bouton Enrôler */}
      <CreateGuard resource={Resource.AGENT}>
        <Dialog open={showEnrollDialog} onOpenChange={setShowEnrollDialog}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              Enrôler un Agent
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Enrôler un Nouvel Agent</DialogTitle>
              <DialogDescription>
                Complétez les informations pour enrôler un agent. Un SMS de bienvenue sera automatiquement envoyé.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Nom *</label>
                <Input
                  placeholder="Ex: Diop"
                  value={formData.nom}
                  onChange={(e) =>
                    setFormData({ ...formData, nom: e.target.value })
                  }
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Prénom *</label>
                <Input
                  placeholder="Ex: Fatou"
                  value={formData.prenom}
                  onChange={(e) =>
                    setFormData({ ...formData, prenom: e.target.value })
                  }
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Téléphone *</label>
                <Input
                  placeholder="+221701234567"
                  value={formData.telephone}
                  onChange={(e) =>
                    setFormData({ ...formData, telephone: e.target.value })
                  }
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Type d'Agent *</label>
                <Select
                  value={formData.type}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      type: value as "sage_femme" | "agent_sante",
                    })
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sage_femme">Sage-femme</SelectItem>
                    <SelectItem value="agent_sante">Agent de Santé</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleEnrollNewAgent}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Enrôler et Envoyer SMS
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CreateGuard>

      {/* Tableau des Agents */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Agents</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredAgents.length === 0 ? (
            <div className="text-center py-8">
              <Users className="mx-auto h-12 w-12 text-slate-300" />
              <p className="mt-2 text-slate-600">Aucun agent enrôlé</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom Prénom</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Téléphone</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>SMS</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAgents.map((agent) => (
                    <TableRow key={agent.id}>
                      <TableCell className="font-medium">
                        {agent.prenom} {agent.nom}
                      </TableCell>
                      <TableCell>
                        <span className="text-xs bg-slate-100 px-2 py-1 rounded">
                          {agent.type === "sage_femme" ? "Sage-femme" : "Agent Santé"}
                        </span>
                      </TableCell>
                      <TableCell className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-slate-400" />
                        {agent.telephone}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {agent.code_enrolement}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`text-xs px-2 py-1 rounded font-medium ${
                            agent.statut === "actif"
                              ? "bg-green-100 text-green-700"
                              : agent.statut === "enroule"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {agent.statut === "actif"
                            ? "Actif"
                            : agent.statut === "enroule"
                              ? "Enrôlé"
                              : "En attente"}
                        </span>
                      </TableCell>
                      <TableCell>
                        {agent.sms_envoye ? (
                          <span className="text-xs text-green-600 flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" />
                            {agent.date_sms_envoye}
                          </span>
                        ) : (
                          <span className="text-xs text-orange-600">Non envoyé</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewAgentDetail(agent)}
                            title="Voir détails"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewSMSHistory(agent)}
                            title="Historique SMS"
                          >
                            <MessageSquare className="h-3 w-3" />
                            {getSMSHistoryForAgent(agent.telephone).length}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Historique SMS Modal */}
      <Dialog open={showSMSHistory} onOpenChange={setShowSMSHistory}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Historique SMS - {selectedAgent?.prenom} {selectedAgent?.nom}
            </DialogTitle>
            <DialogDescription>
              Téléphone: {selectedAgent?.telephone}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {smsHistory.length === 0 ? (
              <div className="text-center py-8 text-slate-600">
                Aucun SMS envoyé pour cet agent
              </div>
            ) : (
              smsHistory.map((sms) => (
                <Card key={sms.id} className="bg-slate-50">
                  <CardContent className="pt-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="text-sm font-medium text-slate-600">
                          {new Date(sms.date_envoi).toLocaleDateString("fr-FR")}
                        </p>
                        <p className="text-xs text-slate-500">
                          Statut: <span className="font-medium">{sms.statut}</span>
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopySMS(sms)}
                      >
                        Copier
                      </Button>
                    </div>
                    <div className="bg-white p-3 rounded border border-slate-200 text-sm text-slate-700 whitespace-pre-wrap">
                      {sms.contenu}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Détails Agent Modal */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Détails Agent - {selectedAgent?.prenom} {selectedAgent?.nom}
            </DialogTitle>
          </DialogHeader>

          {selectedAgent && (
            <div className="space-y-6">
              {/* Informations Personnelles */}
              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-3">
                  Informations Personnelles
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-600">Nom</p>
                    <p className="text-sm font-medium text-slate-900">
                      {selectedAgent.nom}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600">Prénom</p>
                    <p className="text-sm font-medium text-slate-900">
                      {selectedAgent.prenom}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-slate-600">Téléphone</p>
                    <p className="text-sm font-medium text-slate-900 flex items-center gap-2">
                      <Phone className="h-4 w-4 text-slate-400" />
                      {selectedAgent.telephone}
                    </p>
                  </div>
                </div>
              </div>

              {/* Informations Professionnelles */}
              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-3">
                  Informations Professionnelles
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-600">Type d'Agent</p>
                    <p className="text-sm font-medium text-slate-900">
                      {selectedAgent.type === "sage_femme"
                        ? "Sage-femme"
                        : "Agent de Santé"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600">Structure</p>
                    <p className="text-sm font-medium text-slate-900">
                      {selectedAgent.structure}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600">District</p>
                    <p className="text-sm font-medium text-slate-900">
                      {selectedAgent.district}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600">Région</p>
                    <p className="text-sm font-medium text-slate-900">
                      {selectedAgent.region || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Informations d'Enrôlement */}
              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-3">
                  Statut d'Enrôlement
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-600">Statut</p>
                    <p className="text-sm font-medium mt-1">
                      <span
                        className={`inline-block px-2 py-1 rounded font-medium text-xs ${
                          selectedAgent.statut === "actif"
                            ? "bg-green-100 text-green-700"
                            : selectedAgent.statut === "enroule"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {selectedAgent.statut === "actif"
                          ? "Actif"
                          : selectedAgent.statut === "enroule"
                            ? "Enrôlé"
                            : "En attente"}
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600">Code d'Enrôlement</p>
                    <p className="text-sm font-mono font-medium text-slate-900 mt-1">
                      {selectedAgent.code_enrolement}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600">Date d'Enrôlement</p>
                    <p className="text-sm font-medium text-slate-900">
                      {selectedAgent.date_enrolement}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600">Compte Créé</p>
                    <p className="text-sm font-medium text-slate-900">
                      {selectedAgent.compte_cree ? (
                        <span className="text-green-600 flex items-center gap-1">
                          <CheckCircle className="h-4 w-4" />
                          Oui
                        </span>
                      ) : (
                        <span className="text-orange-600">Non</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Informations SMS */}
              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-3">
                  Envoi SMS
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-600">SMS Envoyé</p>
                    <p className="text-sm font-medium text-slate-900">
                      {selectedAgent.sms_envoye ? (
                        <span className="text-green-600 flex items-center gap-1">
                          <CheckCircle className="h-4 w-4" />
                          Oui
                        </span>
                      ) : (
                        <span className="text-orange-600">Non</span>
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600">Date d'Envoi</p>
                    <p className="text-sm font-medium text-slate-900">
                      {selectedAgent.date_sms_envoye || "N/A"}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-slate-600">Lien de Téléchargement</p>
                    <p className="text-sm font-mono bg-slate-100 p-2 rounded mt-1 break-all">
                      {selectedAgent.lien_telecharger}
                    </p>
                  </div>
                </div>
              </div>

              {/* Boutons d'Action */}
              <div className="flex gap-2 justify-end pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowDetailModal(false);
                  }}
                >
                  Fermer
                </Button>
                {selectedAgent.sms_envoye ? (
                  <Button
                    onClick={() => {
                      handleResendSMS(selectedAgent);
                      setShowDetailModal(false);
                    }}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Renvoyer SMS
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      handleResendSMS(selectedAgent);
                      setShowDetailModal(false);
                    }}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Envoyer SMS
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
