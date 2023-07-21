import FormSubmitButton from '@/components/FormSubmitButton';
import { prisma } from '@/lib/db/prisma';
import { redirect } from 'next/navigation';
import React from 'react'

export const metadata={
  title: "Add Product - Barbie"
}

async function addProduct(formData: FormData) {

  "use server";
  const name = formData.get("name")?.toString();
  const description = formData.get("description")?.toString();
  const imageUrl = formData.get("imageUrl")?.toString();
  const price = Number(formData.get("price") || 0);

  if (!name || !description || !imageUrl || !price){
    throw Error("Missing required fields")
  }

  await prisma.products.create({
      data: { name, description, imageUrl, price}
  });

  redirect("/");
}

const AddProductPage = () => {
  return (
    <div className='flex flex-col gap-4 max-w-7xl'>
        <h1 className='mb-3 text-lg font-bold'>Add Product</h1>
        <form action={addProduct} className='flex flex-col gap-2'>
        <input required 
        name="name" type="text" placeholder="Name" 
        className="input input-bordered w-full " />
        <textarea required 
        name='description' placeholder='Description'
        className='textarea-bordered textarea w-full'/>
        <input required 
        name="imageUrl" type="url" placeholder="Image Url" 
        className="input input-bordered w-full" />
        <input required 
        name="price" type="number" placeholder="Price" 
        className="input input-bordered w-full" />
        <FormSubmitButton className='btn-block'>Add Product</FormSubmitButton>
        </form>
    </div>
  )
}

export default AddProductPage