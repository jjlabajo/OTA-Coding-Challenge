import React, { useState, useEffect } from 'react';
import Button from '@/ui/components/Button';
import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Heading2,
  Undo,
  Redo,
} from 'lucide-react';

interface User {
  id: number;
  name: string;
}

export interface JobPosting {
  id?: number;
  position: string;
  employment_type: string;
  office: string;
  description: string;
  created_at?: string;
  updated_at?: string;
  company?: string;
  user_id?: number;
  user?: User;
}

interface JobPostingFormProps {
  initialData?: JobPosting;
  onSubmit: (data: Omit<JobPosting, 'id' | 'created_at' | 'updated_at' | 'user'>) => void;
  isLoading?: boolean;
}

const TiptapToolbar: React.FC<{ editor: Editor | null }> = ({ editor }) => {
  if (!editor) {
    return null;
  }

  const buttonClass = (isActive = false) =>
    `p-1.5 rounded hover:bg-gray-200 transition-colors ${
      isActive ? 'bg-gray-200' : ''
    }`;

  return (
    <div className="flex flex-wrap items-center gap-1 border border-gray-300 rounded-t-md p-2 bg-gray-50">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={buttonClass(editor.isActive('bold'))}
        aria-label="Bold"
      >
        <Bold className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={buttonClass(editor.isActive('italic'))}
        aria-label="Italic"
      >
        <Italic className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={buttonClass(editor.isActive('strike'))}
        aria-label="Strikethrough"
      >
        <Strikethrough className="w-4 h-4" />
      </button>
       <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={buttonClass(editor.isActive('heading', { level: 2 }))}
        aria-label="Heading 2"
      >
        <Heading2 className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={buttonClass(editor.isActive('bulletList'))}
        aria-label="Bullet List"
      >
        <List className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={buttonClass(editor.isActive('orderedList'))}
        aria-label="Ordered List"
      >
        <ListOrdered className="w-4 h-4" />
      </button>
      <div className="h-5 w-px bg-gray-300 mx-1"></div>
      <button
        type="button"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
        className={buttonClass()}
        aria-label="Undo"
       >
         <Undo className="w-4 h-4" />
       </button>
       <button
        type="button"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
        className={buttonClass()}
        aria-label="Redo"
       >
         <Redo className="w-4 h-4" />
       </button>
    </div>
  );
};

const JobPostingForm: React.FC<JobPostingFormProps> = ({
  initialData,
  onSubmit,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<Omit<JobPosting, 'id' | 'created_at' | 'updated_at' | 'user'>>({
    position: initialData?.position || '',
    employment_type: initialData?.employment_type || 'Full-time',
    office: initialData?.office || 'On-site',
    description: initialData?.description || '',
    company: initialData?.company || '',
    user_id: initialData?.user_id,
  });

  const editor = useEditor({
    extensions: [
        StarterKit.configure({
           heading: {
             levels: [2, 3],
           },
        }),
    ],
    content: formData.description,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base lg:prose-lg xl:prose-xl focus:outline-none min-h-[200px] p-4 border border-gray-300 rounded-b-md',
      },
    },
    onUpdate: ({ editor }) => {
      setFormData((prevData) => ({
        ...prevData,
        description: editor.getHTML(),
      }));
    },
  });

  useEffect(() => {
    if (initialData && editor && !editor.isDestroyed) {
        const currentContent = editor.getHTML();
        if (currentContent !== initialData.description) {
          editor.commands.setContent(initialData.description || '', false);
        }

        setFormData({
          position: initialData.position || '',
          employment_type: initialData.employment_type || 'Full-time',
          office: initialData.office || 'On-site',
          description: initialData.description || '',
          company: initialData.company || '',
          user_id: initialData.user_id,
        });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData, editor]);


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const finalData = {
      ...formData,
      description: editor?.getHTML() || '',
    };
    onSubmit(finalData);
  };

  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const inputClass = "block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm";
  const selectClass = `${inputClass} pr-8`;
  const buttonClass = `inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md ${
    isLoading
      ? 'bg-indigo-400 cursor-not-allowed'
      : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
  }`;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-4 md:p-6 bg-white rounded-lg shadow w-[50vw] mx-auto">
      <div>
        <label htmlFor="position" className={labelClass}>
          Position Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="position"
          id="position"
          value={formData.position}
          onChange={handleChange}
          required
          className={inputClass}
          placeholder="e.g., Software Engineer"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="employment_type" className={labelClass}>
            Employment Type <span className="text-red-500">*</span>
          </label>
          <select
            name="employment_type"
            id="employment_type"
            value={formData.employment_type}
            onChange={handleChange}
            required
            className={selectClass}
          >
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Temporary">Temporary</option>
            <option value="Internship">Internship</option>
          </select>
        </div>
        <div>
          <label htmlFor="office" className={labelClass}>
            Office Location <span className="text-red-500">*</span>
          </label>
          <select
            name="office"
            id="office"
            value={formData.office}
            onChange={handleChange}
            required
            className={selectClass}
          >
            <option value="On-site">On-site</option>
            <option value="Remote">Remote</option>
            <option value="Hybrid">Hybrid</option>
          </select>
        </div>
      </div>

       <div>
        <label htmlFor="company" className={labelClass}>
          Company *
        </label>
        <input
          type="text"
          name="company"
          id="company"
          value={formData.company}
          onChange={handleChange}
          className={inputClass}
          required
          placeholder="e.g., Acme Corporation"
        />
      </div>


      <div>
        <label htmlFor="description" className={labelClass}>
          Job Description <span className="text-red-500">*</span>
        </label>
        <TiptapToolbar editor={editor} />
        <EditorContent editor={editor} id="description" />
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          className={buttonClass}
          disabled={isLoading || !editor}
        >
          {isLoading ? 'Saving...' : (initialData ? 'Update Job Posting' : 'Create Job Posting')}
        </Button>
      </div>
    </form>
  );
};

export default JobPostingForm;