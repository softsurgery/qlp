import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { parentApi } from '../lib/api';
import { Baby, Plus } from 'lucide-react';

export default function ChildrenPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [selectedChild, setSelectedChild] = useState<string | null>(null);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', dateOfBirth: '' });

  const { data: children } = useQuery({
    queryKey: ['children'],
    queryFn: () => parentApi.getChildren().then((r) => r.data),
  });

  const { data: childProgress } = useQuery({
    queryKey: ['childProgress', selectedChild],
    queryFn: () => parentApi.getChildProgress(selectedChild!).then((r) => r.data),
    enabled: !!selectedChild,
  });

  const createMutation = useMutation({
    mutationFn: () => parentApi.createChild(form),
    onSuccess: () => {
      toast.success('Child account created');
      setShowForm(false);
      queryClient.invalidateQueries({ queryKey: ['children'] });
    },
    onError: () => toast.error('Failed to create child account'),
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{t('parent.title')}</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm"
        >
          <Plus className="w-4 h-4" />
          {t('parent.addChild')}
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-3">
          {children?.map((child: any) => (
            <button
              key={child.id}
              onClick={() => setSelectedChild(child.id)}
              className={`w-full p-4 border rounded-xl flex items-center gap-3 text-start transition-colors ${
                selectedChild === child.id ? 'border-primary bg-primary/5' : 'border-border'
              }`}
            >
              <Baby className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium">{child.firstName} {child.lastName}</p>
                <p className="text-sm text-muted-foreground">{child.email}</p>
              </div>
            </button>
          ))}
          {!children?.length && <p className="text-muted-foreground">No children linked yet</p>}
        </div>

        {selectedChild && childProgress && (
          <div className="p-6 border border-border rounded-xl">
            <h2 className="font-semibold mb-4">{t('parent.viewProgress')}</h2>
            <p className="text-2xl font-bold mb-2">{childProgress.progress?.completedCount || 0} lessons</p>
            <p className="text-sm text-muted-foreground mb-4">
              {childProgress.progress?.percentage || 0}% complete
            </p>
            <h3 className="font-medium mb-2">Achievements</h3>
            <ul className="space-y-1">
              {childProgress.achievements?.earned?.map((a: any) => (
                <li key={a.id} className="text-sm">{a.name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-xl w-full max-w-md mx-4 space-y-3">
            <h3 className="font-semibold">{t('parent.addChild')}</h3>
            <input className="w-full border border-border rounded-lg px-3 py-2 text-sm" placeholder="First Name" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
            <input className="w-full border border-border rounded-lg px-3 py-2 text-sm" placeholder="Last Name" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
            <input className="w-full border border-border rounded-lg px-3 py-2 text-sm" placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <input className="w-full border border-border rounded-lg px-3 py-2 text-sm" placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            <input className="w-full border border-border rounded-lg px-3 py-2 text-sm" placeholder="Date of Birth" type="date" value={form.dateOfBirth} onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })} />
            <div className="flex gap-3">
              <button onClick={() => setShowForm(false)} className="flex-1 py-2 border border-border rounded-lg">Cancel</button>
              <button onClick={() => createMutation.mutate()} className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg">Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
