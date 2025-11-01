import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Patient } from "@/data/mockData";
import { Phone, Calendar, User, MapPin, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface PatientCardProps {
  patient: Patient;
}

export const PatientCard = ({ patient }: PatientCardProps) => {
  const handleAlertSonu = () => {
    toast.success(`Alerte SONU envoyée pour ${patient.prenom} ${patient.nom}`);
  };

  const getStatusBadge = (statut: string) => {
    switch (statut) {
      case 'actif':
        return <Badge className="bg-[hsl(var(--status-vert))] text-white">Actif</Badge>;
      case 'en_attente':
        return <Badge className="bg-[hsl(var(--status-orange))] text-white">En attente</Badge>;
      case 'a_renouveler':
        return <Badge className="bg-[hsl(var(--status-rouge))] text-white">À renouveler</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card className="shadow-card hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{patient.prenom} {patient.nom}</h3>
              <p className="text-sm text-muted-foreground">{patient.age} ans</p>
            </div>
          </div>
          {getStatusBadge(patient.statut_csu)}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span>{patient.telephone}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{patient.semaines} SA</span>
          </div>
          <div className="flex items-center gap-2 col-span-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs">{patient.structure}</span>
          </div>
          <div className="flex items-center gap-2 col-span-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs">Agent: {patient.agent}</span>
          </div>
        </div>

        <div className="pt-2 border-t">
          <Button 
            onClick={handleAlertSonu} 
            className="w-full bg-[hsl(var(--status-rouge))] hover:bg-[hsl(var(--status-rouge))]/90 text-white"
            size="sm"
          >
            <AlertTriangle className="h-4 w-4 mr-2" />
            Alerte SONU
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
