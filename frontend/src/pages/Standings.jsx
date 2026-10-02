import { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useAdmin } from "../context/AdminContext";
import { groups as fallbackGroups, flagUrl } from "../data/teams";

function TeamForm({ initial, onCancel, onSaved }) {
  const { t } = useLanguage();
  const { adminHeaders } = useAdmin();

  const [form, setForm] = useState(
    initial || {
      teamId: "",
      name: "",
      iso: "",
      group: "A",
      pj: 0,
      dg: 0,
      pts: 0,
    }
  );

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const save = async () => {
    setError("");

    if (!form._id && !form.teamId.trim()) {
      setError("Debes ingresar el ID corto del equipo.");
      return;
    }

    if (!form.name.trim()) {
      setError("Debes ingresar el nombre del equipo.");
      return;
    }

    if (!form.iso.trim()) {
      setError("Debes ingresar el código ISO del país.");
      return;
    }

    if (!form.group) {
      setError("Debes seleccionar un grupo.");
      return;
    }

    setSaving(true);

    try {
      const method = form._id ? "PUT" : "POST";
      const url = form._id
        ? `/api/teams/${form._id}`
        : "/api/teams";

      const response = await fetch(url, {
        method,
        headers: adminHeaders(),
        body: JSON.stringify({
          teamId: form.teamId,
          name: form.name.trim(),
          iso: form.iso.trim().toLowerCase(),
          group: form.group,
          pj: Number(form.pj) || 0,
          dg: Number(form.dg) || 0,
          pts: Number(form.pts) || 0,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.detail ||
          data.error ||
          "No se pudo guardar el equipo."
        );
      }

      onSaved();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-form-card">
      <h3 style={{ marginTop: 0 }}>
        {form._id ? "✏️ Editar equipo" : "➕ Agregar equipo"}
      </h3>

      {error && (
        <div
          style={{
            background: "#3b1111",
            color: "#ffb4b4",
            padding: "10px 12px",
            borderRadius: "8px",
            marginBottom: "15px",
          }}
        >
          ⚠️ {error}
        </div>
      )}

      {!form._id && (
        <div className="form-group">
          <label>ID corto</label>
          <input
            value={form.teamId}
            onChange={(e) =>
              setForm({
                ...form,
                teamId: e.target.value.toLowerCase(),
              })
            }
            placeholder="ej. arg"
          />
          <small>Ejemplo: arg, mex, bra, fra</small>
        </div>
      )}

      <div className="form-group">
        <label>{t("admin_team_name")}</label>
        <input
          value={form.name}
          onChange={(e) =>
            setForm({
              ...form,
              name: e.target.value,
            })
          }
          placeholder="Nombre del equipo"
        />
      </div>

      <div className="form-group">
        <label>{t("admin_team_iso")}</label>
        <input
          value={form.iso}
          onChange={(e) =>
            setForm({
              ...form,
              iso: e.target.value.toLowerCase(),
            })
          }
          placeholder="ej. ar, fr, mx"
          maxLength={2}
        />
      </div>

      <div className="form-group">
        <label>{t("admin_team_group")}</label>
        <select
          value={form.group}
          onChange={(e) =>
            setForm({
              ...form,
              group: e.target.value,
            })
          }
        >
          {["A", "B", "C", "D", "E", "F", "G", "H"].map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>{t("admin_team_pj")}</label>
        <input
          type="number"
          min="0"
          value={form.pj}
          onChange={(e) =>
            setForm({
              ...form,
              pj: Number(e.target.value),
            })
          }
        />
      </div>

      <div className="form-group">
        <label>{t("admin_team_dg")}</label>
        <input
          type="number"
          value={form.dg}
          onChange={(e) =>
            setForm({
              ...form,
              dg: Number(e.target.value),
            })
          }
        />
      </div>

      <div className="form-group">
        <label>{t("admin_team_pts")}</label>
        <input
          type="number"
          min="0"
          value={form.pts}
          onChange={(e) =>
            setForm({
              ...form,
              pts: Number(e.target.value),
            })
          }
        />
      </div>

      <div className="admin-form-actions">
        <button
          className="btn-add"
          onClick={save}
          disabled={saving}
        >
          {saving ? "Guardando..." : t("admin_save")}
        </button>

        <button
          className="btn-ghost"
          onClick={onCancel}
          disabled={saving}
        >
          {t("admin_cancel")}
        </button>
      </div>
    </div>
  );
}

export default function Standings() {
  const { t } = useLanguage();
  const { isAdmin, adminHeaders } = useAdmin();

  const [groups, setGroups] = useState(null);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");

  const load = async () => {
    setError("");

    try {
      const response = await fetch("/api/teams/groups");

      if (!response.ok) {
        throw new Error("No se pudieron cargar las clasificaciones.");
      }

      const data = await response.json();

      if (data && Object.keys(data).length > 0) {
        setGroups(data);
      } else {
        setGroups(fallbackGroups);
      }
    } catch (err) {
      console.error(err);
      setGroups(fallbackGroups);
      setError(
        "No se pudo conectar con el servidor. Se están mostrando los datos de ejemplo."
      );
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onDelete = async (id) => {
    if (!confirm(t("admin_confirm_delete"))) return;

    try {
      const response = await fetch(`/api/teams/${id}`, {
        method: "DELETE",
        headers: adminHeaders(),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.detail ||
          data.error ||
          "No se pudo eliminar el equipo."
        );
      }

      await load();
    } catch (err) {
      alert(`⚠️ ${err.message}`);
    }
  };

  if (!groups) return null;

  return (
    <section
      className="section"
      style={{ marginTop: 24 }}
    >
      <div className="admin-topbar">
        <h2
          className="section-title"
          style={{ marginBottom: 0 }}
        >
          🏆 {t("standings_title")}
        </h2>

        {isAdmin && (
          <button
            className="btn-add"
            onClick={() => setEditing({})}
          >
            + {t("admin_new_team")}
          </button>
        )}
      </div>

      {error && (
        <div
          style={{
            background: "#3b1111",
            color: "#ffb4b4",
            padding: "10px 14px",
            borderRadius: "8px",
            margin: "15px 0",
          }}
        >
          ⚠️ {error}
        </div>
      )}

      {isAdmin && editing && (
        <TeamForm
          initial={editing._id ? editing : null}
          onCancel={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            load();
          }}
        />
      )}

      <div className="groups-grid">
        {Object.entries(groups).map(([letter, teams]) => {
          const sorted = [...teams].sort(
            (a, b) =>
              b.pts - a.pts ||
              b.dg - a.dg
          );

          return (
            <div
              key={letter}
              className="group-card"
            >
              <div className="group-header">
                Grupo {letter}
              </div>

              <table className="standings-table">
                <thead>
                  <tr>
                    <th></th>
                    <th>{t("team")}</th>
                    <th>{t("played")}</th>
                    <th>{t("diff")}</th>
                    <th>{t("points")}</th>
                    {isAdmin && <th></th>}
                  </tr>
                </thead>

                <tbody>
                  {sorted.map((team, i) => (
                    <tr
                      key={
                        team._id ||
                        team.id ||
                        team.teamId
                      }
                    >
                      <td>
                        <span className="rank">
                          {i + 1}
                        </span>
                      </td>

                      <td className="team-cell">
                        <img
                          className="flag-icon sm"
                          src={flagUrl(team.iso)}
                          alt={team.name}
                        />

                        {team.name}
                      </td>

                      <td>{team.pj}</td>

                      <td>
                        {team.dg > 0
                          ? `+${team.dg}`
                          : team.dg}
                      </td>

                      <td className="pts">
                        {team.pts}
                      </td>

                      {isAdmin && team._id && (
                        <td>
                          <div className="standings-admin-cell">
                            <button
                              className="btn-small btn-edit"
                              onClick={() =>
                                setEditing(team)
                              }
                              title="Editar"
                            >
                              ✏️
                            </button>

                            <button
                              className="btn-small btn-delete"
                              onClick={() =>
                                onDelete(team._id)
                              }
                              title="Eliminar"
                            >
                              🗑
                            </button>
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
