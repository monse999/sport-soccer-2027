import { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useAdmin } from "../context/AdminContext";
import { newsItems as fallbackNews } from "../data/news";

function timeAgoLabel(publishedAt, t) {
  const hours = Math.max(1, Math.round((Date.now() - new Date(publishedAt).getTime()) / 3600000));
  return hours >= 24 ? t("day_ago", { n: Math.round(hours / 24) }) : t("hours_ago", { n: hours });
}

function NewsModal({ item, onClose }) {
  const { t } = useLanguage();
  if (!item) return null;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div style={{ position: "relative" }}>
          {item.image && <div className="modal-image" style={{ backgroundImage: `url(${item.image})` }} />}
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="modal-title">{item.title}</div>
          <div className="modal-meta">{t("source_label")}: {item.source} · {timeAgoLabel(item.publishedAt, t)}</div>
          <div className="modal-text">{item.isExternal ? item.summary : (item.body || item.summary)}</div>
          {item.isExternal && item.link && (
            <a className="modal-link-btn" href={item.link} target="_blank" rel="noopener noreferrer">📰 {t("read_more")}</a>
          )}
        </div>
      </div>
    </div>
  );
}

function NewsForm({ initial, onCancel, onSaved }) {
  const { t } = useLanguage();
  const { adminHeaders } = useAdmin();
  const [form, setForm] = useState(initial || { title: "", summary: "", body: "", image: "" });
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    const method = form._id ? "PUT" : "POST";
    const url = form._id ? `/api/news/${form._id}` : "/api/news";
    await fetch(url, { method, headers: adminHeaders(), body: JSON.stringify(form) });
    setSaving(false);
    onSaved();
  };

  return (
    <div className="admin-form-card">
      <div className="form-group">
        <label>{t("admin_news_title_label")}</label>
        <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
      </div>
      <div className="form-group">
        <label>{t("admin_news_summary_label")}</label>
        <input value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} />
      </div>
      <div className="form-group">
        <label>{t("admin_news_body_label")}</label>
        <textarea rows={5} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} />
      </div>
      <div className="form-group">
        <label>{t("admin_news_image_label")}</label>
        <input value={form.image || ""} onChange={(e) => setForm({ ...form, image: e.target.value })} />
      </div>
      <div className="admin-form-actions">
        <button className="btn-add" onClick={save} disabled={saving || !form.title}>{saving ? "..." : t("admin_save")}</button>
        <button className="btn-ghost" onClick={onCancel}>{t("admin_cancel")}</button>
      </div>
    </div>
  );
}

export default function News() {
  const { t } = useLanguage();
  const { isAdmin, adminHeaders } = useAdmin();
  const [news, setNews] = useState([]);
  const [selected, setSelected] = useState(null);
  const [editing, setEditing] = useState(null);

  const load = () => {
    fetch("/api/news")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => setNews(data.length ? data : fallbackNews))
      .catch(() => setNews(fallbackNews));
  };

  useEffect(() => { load(); }, []);

  const onDelete = async (e, id) => {
    e.stopPropagation();
    if (!confirm(t("admin_confirm_delete"))) return;
    await fetch(`/api/news/${id}`, { method: "DELETE", headers: adminHeaders() });
    load();
  };

  const onEdit = (e, item) => {
    e.stopPropagation();
    setEditing(item);
  };

  return (
    <section className="section" style={{ marginTop: 24 }}>
      <div className="admin-topbar">
        <h2 className="section-title" style={{ marginBottom: 0 }}>📰 {t("news_title")}</h2>
        {isAdmin && (
          <button className="btn-add" onClick={() => setEditing({})}>+ {t("admin_new_news_title")}</button>
        )}
      </div>

      {isAdmin && editing && (
        <NewsForm
          initial={editing._id ? editing : null}
          onCancel={() => setEditing(null)}
          onSaved={() => { setEditing(null); load(); }}
        />
      )}

      <div className="news-grid">
        {news.map((n) => (
          <button key={n._id || n.id} className="news-card" onClick={() => setSelected(n)}>
            <div className="news-image" style={{ backgroundImage: n.image ? `url(${n.image})` : undefined }} />
            <div className="news-body">
              <div className="news-time">
                <span>🗓 {timeAgoLabel(n.publishedAt || Date.now(), t)}</span>
                {n.source && <span className="news-source">{n.source}</span>}
              </div>
              <div className="news-headline">{n.title}</div>
              {isAdmin && n._id && (
                <div className="news-admin-actions">
                  {!n.isExternal && (
                    <button className="btn-small btn-edit" onClick={(e) => onEdit(e, n)}>✏️ {t("admin_edit")}</button>
                  )}
                  <button className="btn-small btn-delete" onClick={(e) => onDelete(e, n._id)}>🗑 {t("admin_delete")}</button>
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
      <NewsModal item={selected} onClose={() => setSelected(null)} />
    </section>
  );
}