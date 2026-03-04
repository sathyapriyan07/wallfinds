import { useState } from 'react';
import { FiEdit, FiPlus, FiTrash2 } from 'react-icons/fi';
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from '../hooks/useCategories';

const ManageCategories = () => {
  const { data: categories } = useCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    cover_image: '',
  });

  const generateSlug = (name) => {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (editingId) {
        await updateCategory.mutateAsync({ id: editingId, updates: formData });
      } else {
        await createCategory.mutateAsync(formData);
      }

      setShowForm(false);
      setEditingId(null);
      setFormData({ name: '', slug: '', cover_image: '' });
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const handleEdit = (category) => {
    setEditingId(category.id);
    setFormData({
      name: category.name,
      slug: category.slug,
      cover_image: category.cover_image,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this category?')) {
      await deleteCategory.mutateAsync(id);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold">Categories</h1>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingId(null);
            setFormData({ name: '', slug: '', cover_image: '' });
          }}
          className="btn-primary inline-flex items-center gap-2"
        >
          <FiPlus /> Add Category
        </button>
      </div>

      {showForm && (
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">{editingId ? 'Edit' : 'Add'} Category</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="space-y-2">
              <span className="small-label text-sm">Name</span>
              <input
                type="text"
                value={formData.name}
                onChange={(event) => {
                  const name = event.target.value;
                  setFormData({ ...formData, name, slug: generateSlug(name) });
                }}
                required
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl"
              />
            </label>

            <label className="space-y-2">
              <span className="small-label text-sm">Slug</span>
              <input
                type="text"
                value={formData.slug}
                onChange={(event) => setFormData({ ...formData, slug: event.target.value })}
                required
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl"
              />
            </label>

            <label className="space-y-2 md:col-span-2">
              <span className="small-label text-sm">Cover Image URL</span>
              <input
                type="url"
                value={formData.cover_image}
                onChange={(event) => setFormData({ ...formData, cover_image: event.target.value })}
                required
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl"
              />
            </label>

            <div className="md:col-span-2 flex gap-2">
              <button type="submit" className="btn-primary">
                {editingId ? 'Update' : 'Create'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-soft">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.03]">
        <table className="w-full text-left">
          <thead className="bg-white/[0.04] border-b border-white/10">
            <tr>
              <th className="px-4 py-3 text-sm font-medium">Cover</th>
              <th className="px-4 py-3 text-sm font-medium">Title</th>
              <th className="px-4 py-3 text-sm font-medium">Slug</th>
              <th className="px-4 py-3 text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories?.map((category) => (
              <tr key={category.id} className="border-b border-white/5 hover:bg-white/[0.03]">
                <td className="px-4 py-3">
                  <img src={category.cover_image} alt={category.name} className="w-16 h-10 rounded object-cover" />
                </td>
                <td className="px-4 py-3 font-medium">{category.name}</td>
                <td className="px-4 py-3 text-slate-300">/{category.slug}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(category)} className="btn-soft inline-flex items-center gap-1 px-3 py-1.5">
                      <FiEdit size={14} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-red-400/50 text-red-200 hover:bg-red-500/15"
                    >
                      <FiTrash2 size={14} /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageCategories;
