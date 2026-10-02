import { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useAdmin } from "../context/AdminContext";
import { groups as fallbackGroups, flagUrl } from "../data/teams";

function TeamForm({ initial, onCancel, onSaved }) {
  const { t } = useLanguage();
  const { adminHeaders } = useAdmin();
  const [form, setForm] = useState(initial || { teamId: "", name: "", iso: "", group: "A", pj: 0, dg: 0, pts: 0 });
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    const method = form._id ? "PUT" : "POST";
    const url = form._id ? `/api/teams/${form._id}` : "/api/teams";
    await fetch(url, { method, headers: adminHeaders(), body: JSON.stringify(form) });
    setSaving(false);
    onSaved();
  };

  return (
    <div className="admin-form-card">
      {!form._id && (
        <div className="form-group">
          <label>ID corto (ej. "arg")</label>
          <input value={form.teamId} onChange={(e) => setForm({ ...form, teamId: e.target.value })} />
        </div>
      )}
      <div className="form-group">
        <label>{t("admin_team_name")}</label>
        <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      </div>
      <div className="form-group">
        <label>{t("admin_team_iso")}</label>
        <input value={form.iso} onChange={(e) => setForm({ ...form, iso: e.target.value })} placeholder="ej. ar, fr, mx" />
      </div>
      <div className="form-group">
        <label>{t("admin_team_group")}</label>
        <select value={form.group} onChange={(e) => setForm({ ...form, group: e.target.value })}>
          {["A","B","C","D","E","F","G","H"].map((g) => <option key={g} value={g}>{g}</option>)}
        </select>
      </div>
      <div className="form-group">
        <label>{t("admin_team_pj")}</label>
        <input type="number" value={form.pj} onChange={(e) => setForm({ ...form, pj: Number(e.target.value) })} />
      </div>
      <div className="form-group">
        <label>{t("admin_team_dg")}</label>
        <input type="number" value={form.dg} onChange={(e) => setForm({ ...form, dg: Number(e.target.value) })} />
      </div>
      <div className="form-group">
        <label>{t("admin_team_pts")}</label>
        <input type="number" value={form.pts} onChange={(e) => setForm({ ...form, pts: Number(e.target.value) })} />
      </div>
      <div className="admin-form-actions">
        <button className="btn-add" onClick={save} disabled={saving || !form.name}>{saving ? "..." : t("admin_save")}</button>
        <button className="btn-ghost" onClick={onCancel}>{t("admin_cancel")}</button>
      </div>
    </div>
  );
}

export default function Standings() {
  const { t } = useLanguage();
  const { isAdmin, adminHeaders } = useAdmin();
  const [groups, setGroups] = useState(null);
  const [editing, setEditing] = useState(null);

  const load = () => {
    fetch("/api/teams/groups")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => setGroups(Object.keys(data).length ? data : fallbackGroups))
      .catch(() => setGroups(fallbackGroups));
  };

  useEffect(() => { load(); }, []);

  const onDelete = async (id) => {
    if (!confirm(t("admin_confirm_delete"))) return;
    await fetch(`/api/teams/${id}`, { method: "DELETE", headers: adminHeaders() });
    load();
  };

  if (!groups) return null;

  return (
    <section className="section" style={{ marginTop: 24 }}>
      <div className="admin-topbar">
        <h2 className="section-title" style={{ marginBottom: 0 }}>🏆 {t("standings_title")}</h2>
        {isAdmin && (
          <button className="btn-add" onClick={() => setEditing({})}>+ {t("admin_new_team")}</button>
        )}
      </div>

      {isAdmin && editing && (
        <TeamForm
          initial={editing._id ? editing : null}
          onCancel={() => setEditing(null)}
          onSaved={() => { setEditing(null); load(); }}
        />
      )}

      <div className="groups-grid">
        {Object.entries(groups).map(([letter, teams]) => {
          const sorted = [...teams].sort((a, b) => b.pts - a.pts || b.dg - a.dg);
          return (
            <div key={letter} className="group-card">
              <div className="group-header">Grupo {letter}</div>
              <table className="standings-table">
                <thead>
                  <tr>
                    <th></th><th>{t("team")}</th><th>{t("played")}</th><th>{t("diff")}</th><th>{t("points")}</th>
                    {isAdmin && <th></th>}
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((team, i) => (
                    <tr key={team._id || team.id}>
                      <td><span className="rank">{i + 1}</span></td>
                      <td className="team-cell"><img className="flag-icon sm" src={flagUrl(team.iso)} alt={team.name} /> {team.name}</td>
                      <td>{team.pj}</td>
                      <td>{team.dg > 0 ? `+${team.dg}` : team.dg}</td>
                      <td className="pts">{team.pts}</td>
                      {isAdmin && team._id && (
                        <td>
                          <div className="standings-admin-cell">
                            <button className="btn-small btn-edit" onClick={() => setEditing(team)}>✏️</button>
                            <button className="btn-small btn-delete" onClick={() => onDelete(team._id)}>🗑</button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })}
      </div>
    </section>
  );
}