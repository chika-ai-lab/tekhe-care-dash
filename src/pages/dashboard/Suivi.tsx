import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockCPNMonthly, mockRdvRetards } from "@/data/mockData";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Phone, Mail } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export default function Suivi() {
  const { user } = useAuth();
  
  // Filtrer les rendez-vous selon le rôle de l'utilisateur
  const userRdvRetards = user?.role === 'sage_femme'
    ? mockRdvRetards.filter(rdv => rdv.agent === `${user.prenom} ${user.nom}`)
    : user?.role === 'responsable_structure' && user.structure
    ? mockRdvRetards.filter(rdv => rdv.structure === user.structure)
    : mockRdvRetards;
  
  const handleRappelSMS = (telephone: string, nom: string) => {
    toast.success(`Rappel SMS envoyé à ${nom} (${telephone})`);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Suivi CPN</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">Filtrer par structure</Button>
          <Button size="sm">Export Excel</Button>
        </div>
      </div>

      {/* Graphique CPN1-4 par mois */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Évolution CPN1-4 par mois</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={mockCPNMonthly}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mois" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="cpn1" stroke="hsl(var(--chart-1))" strokeWidth={2} name="CPN1" />
              <Line type="monotone" dataKey="cpn2" stroke="hsl(var(--chart-2))" strokeWidth={2} name="CPN2" />
              <Line type="monotone" dataKey="cpn3" stroke="hsl(var(--chart-3))" strokeWidth={2} name="CPN3" />
              <Line type="monotone" dataKey="cpn4" stroke="hsl(var(--chart-4))" strokeWidth={2} name="CPN4" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Tableau RDV en retard */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Rendez-vous en retard (&gt; 3 jours)</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patiente</TableHead>
                <TableHead>Âge</TableHead>
                <TableHead>Semaines</TableHead>
                <TableHead>Retard (jours)</TableHead>
                <TableHead>Agent</TableHead>
                <TableHead>Structure</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userRdvRetards.map((rdv) => (
                <TableRow key={rdv.id}>
                  <TableCell className="font-medium">{rdv.patient_nom}</TableCell>
                  <TableCell>{rdv.age} ans</TableCell>
                  <TableCell>{rdv.semaines} SA</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[hsl(var(--status-orange)/0.1)] text-[hsl(var(--status-orange))]">
                      {rdv.retard_jours}j
                    </span>
                  </TableCell>
                  <TableCell>{rdv.agent}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{rdv.structure}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRappelSMS(rdv.telephone, rdv.patient_nom)}
                      >
                        <Phone className="h-3 w-3 mr-1" />
                        SMS
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Mail className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
