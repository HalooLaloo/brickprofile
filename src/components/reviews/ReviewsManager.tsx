"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Star,
  Pencil,
  Trash2,
  X,
  Loader2,
  Crown,
  MapPin,
  Briefcase,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Review } from "@/lib/types";

interface ReviewsManagerProps {
  initialReviews: Review[];
  maxReviews: number;
  isPro: boolean;
  siteId: string;
}

interface ReviewFormData {
  client_name: string;
  client_location: string;
  rating: number;
  text: string;
  project_type: string;
}

const emptyForm: ReviewFormData = {
  client_name: "",
  client_location: "",
  rating: 5,
  text: "",
  project_type: "",
};

export function ReviewsManager({
  initialReviews,
  maxReviews,
  isPro,
  siteId,
}: ReviewsManagerProps) {
  const router = useRouter();
  const [reviews, setReviews] = useState(initialReviews);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<ReviewFormData>(emptyForm);
  const [saving, setSaving] = useState(false);

  const canAdd = reviews.length < maxReviews;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const method = editingId ? "PATCH" : "POST";
      const body = editingId ? { id: editingId, ...formData } : { ...formData, site_id: siteId };

      const response = await fetch("/api/reviews", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const { review } = await response.json();

        if (editingId) {
          setReviews((prev) =>
            prev.map((r) => (r.id === editingId ? review : r))
          );
        } else {
          setReviews((prev) => [review, ...prev]);
        }

        setShowForm(false);
        setEditingId(null);
        setFormData(emptyForm);
        router.refresh();
      } else {
        const data = await response.json();
        alert(data.error || "Failed to save review");
      }
    } catch (error) {
      console.error("Error saving review:", error);
      alert("Failed to save review");
    }

    setSaving(false);
  };

  const handleEdit = (review: Review) => {
    setEditingId(review.id);
    setFormData({
      client_name: review.client_name,
      client_location: review.client_location || "",
      rating: review.rating,
      text: review.text,
      project_type: review.project_type || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    try {
      const response = await fetch(`/api/reviews?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setReviews((prev) => prev.filter((r) => r.id !== id));
        router.refresh();
      }
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData(emptyForm);
  };

  return (
    <div className="space-y-6">
      {/* Add button */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          disabled={!canAdd}
          className="btn-primary btn-md w-full sm:w-auto"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Review
        </button>
      )}

      {/* Form */}
      {showForm && (
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">
              {editingId ? "Edit Review" : "Add New Review"}
            </h3>
            <button onClick={handleCancel} className="btn-ghost btn-sm">
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Client Name *</label>
                <input
                  type="text"
                  value={formData.client_name}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      client_name: e.target.value,
                    }))
                  }
                  className="input"
                  placeholder="John Smith"
                  required
                />
              </div>
              <div>
                <label className="label">Location</label>
                <input
                  type="text"
                  value={formData.client_location}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      client_location: e.target.value,
                    }))
                  }
                  className="input"
                  placeholder="London"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Rating *</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, rating: star }))
                      }
                      className="p-1"
                    >
                      <Star
                        className={cn(
                          "w-6 h-6 transition-colors",
                          star <= formData.rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-dark-600"
                        )}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="label">Project Type</label>
                <input
                  type="text"
                  value={formData.project_type}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      project_type: e.target.value,
                    }))
                  }
                  className="input"
                  placeholder="Kitchen Renovation"
                />
              </div>
            </div>

            <div>
              <label className="label">Review Text *</label>
              <textarea
                value={formData.text}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, text: e.target.value }))
                }
                className="input"
                rows={4}
                placeholder="What the client said about your work..."
                required
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={handleCancel}
                className="btn-secondary btn-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="btn-primary btn-md"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : null}
                {editingId ? "Update" : "Add"} Review
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Upgrade prompt */}
      {!isPro && reviews.length >= maxReviews * 0.8 && (
        <div className="p-4 rounded-lg bg-brand-500/10 border border-brand-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Crown className="w-5 h-5 text-brand-400" />
            <div>
              <p className="font-medium">Need more reviews?</p>
              <p className="text-sm text-dark-400">
                Upgrade to Pro for unlimited reviews.
              </p>
            </div>
          </div>
          <a href="/upgrade" className="btn-primary btn-sm">
            Upgrade
          </a>
        </div>
      )}

      {/* Reviews list */}
      {reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="card p-5">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{review.client_name}</span>
                    {review.client_location && (
                      <span className="flex items-center gap-1 text-sm text-dark-400">
                        <MapPin className="w-3 h-3" />
                        {review.client_location}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={cn(
                            "w-4 h-4",
                            star <= review.rating
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-dark-600"
                          )}
                        />
                      ))}
                    </div>
                    {review.project_type && (
                      <span className="badge-primary text-xs flex items-center gap-1">
                        <Briefcase className="w-3 h-3" />
                        {review.project_type}
                      </span>
                    )}
                  </div>
                  <p className="text-dark-300">&quot;{review.text}&quot;</p>
                </div>
                <div className="flex gap-1 ml-4">
                  <button
                    onClick={() => handleEdit(review)}
                    className="p-2 rounded-lg hover:bg-dark-800 transition-colors"
                  >
                    <Pencil className="w-4 h-4 text-dark-400" />
                  </button>
                  <button
                    onClick={() => handleDelete(review.id)}
                    className="p-2 rounded-lg hover:bg-dark-800 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-dark-400 hover:text-red-400" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-dark-500">
          <Star className="w-12 h-12 mx-auto mb-4 text-dark-700" />
          <p>No reviews yet. Add customer testimonials to build trust!</p>
        </div>
      )}
    </div>
  );
}
