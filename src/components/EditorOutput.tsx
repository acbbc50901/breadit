'use client'

import dynamic from "next/dynamic"
import Image from "next/image"

interface Props {
  content: any
}

const Output = dynamic(async() => (await import('editorjs-react-renderer')).default, {
  ssr: false
})

const style ={
  paragraph: {
    fontSize: '0.875rem',
    lineHeight: '1.25rem',
  }
}

const renderers = {
  image: CustomImageRenderer,
  code: CustomCodeRenderer,
}

const EditorOutput: React.FC<Props> = ({content}) => {
  return <Output data={content} style={style} className='text-sm' renderers={renderers}/>
}

function CustomImageRenderer({data}: any) {
  const src = data.file.url
  return (
    <div className=" relative w-full min-h-[15rem]">
      <Image src={src} alt="Image" className=" object-contain" fill/>
    </div>
  )
}
function CustomCodeRenderer({data}: any) {
  return (
    <pre className=" bg-gray-800 rounded-md p-4">
      <code className=" text-gray-100 text-sm">{data.code}</code>
    </pre>
  )
}

export default EditorOutput