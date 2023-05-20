'use client'
import { CameraIcon } from 'lucide-react'
import MediaPicker from './MediaPicker'
import { FormEvent } from 'react'
import { api } from '@/lib/api'
import Cookie from 'js-cookie'
import { useRouter } from 'next/navigation'

export default function NewMemoryForm() {
  const router = useRouter()
  async function handleCreateNewMemory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)

    const fileToUpload = formData.get('coverUrl')

    let coverUrl = ''

    if (fileToUpload) {
      const uploadFormData = new FormData()
      uploadFormData.set('file', fileToUpload)

      const uploadResponse = await api.post('/upload', uploadFormData)

      coverUrl = uploadResponse.data.url
    }

    const payload = {
      content: formData.get('content'),
      isPublic: formData.get('isPublic'),
      coverUrl,
    }

    const token = Cookie.get('token')

    await api.post('/memories', payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    router.push('/')
  }

  return (
    <form
      onSubmit={handleCreateNewMemory}
      className="flex flex-1 flex-col gap-2"
    >
      <div className="flex items-center gap-4">
        <label
          htmlFor="file"
          className="text-small flex cursor-pointer items-center gap-1.5 text-sm text-gray-200 hover:text-gray-100"
        >
          <CameraIcon className="h4 w-4" />
          Anexar mídia
        </label>

        <label
          htmlFor="isPublic"
          className="flex items-center gap-1.5 text-sm text-gray-200 hover:text-gray-100"
        >
          <input
            type="checkbox"
            name="isPublic"
            id="isPublic"
            value="true"
            className="h-4 w-4 rounded border-gray-400 bg-gray-700 text-purple-500"
          />
          Tornar memoria pública
        </label>
      </div>
      <MediaPicker />

      <textarea
        name="content"
        spellCheck={false}
        placeholder="Fique livre para adicionar fotos, vídeos e relatos sobre essa experiência que você quer lembrar para sempre."
        className="mt-2 w-full flex-1 resize-none rounded border-0 bg-transparent p-0 text-lg leading-relaxed text-gray-100 placeholder:text-gray-400 focus:ring-0"
      />

      <button
        type="submit"
        className="inline-block self-end rounded-full bg-green-500 px-5 py-3 font-alt text-sm uppercase leading-none text-black hover:bg-green-600"
      >
        Salvar
      </button>
    </form>
  )
}
