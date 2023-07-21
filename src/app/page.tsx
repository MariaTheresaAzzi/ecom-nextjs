import PaginationBar from '@/components/Pagination'
import ProductCard from '@/components/ProductCard'
import { prisma } from '@/lib/db/prisma'
import Image from 'next/image'
import Link from 'next/link'


interface HomeProps {
  searchParams: { page: string }
}

export default async function Home({ searchParams: {page = "1"} }: HomeProps) {
  const currentPage = parseInt(page)

  const pageSize = 6
  const heroItemCount = 1

  const totalItemCount = await prisma.products.count();

  const totalPages = Math.ceil((totalItemCount - heroItemCount)/pageSize)

  const products = await prisma.products.findMany({
    orderBy: {id: "desc"},
    skip: (currentPage - 1) * pageSize + (currentPage === 1 ? 0 : heroItemCount),
    take: pageSize + (currentPage === 1 ? heroItemCount: 0),
  })
  return (
    <div>
      {currentPage === 1 &&
      <div className="hero w-full h-[500px] lg:h-screen" style={{backgroundImage: 'url(https://daisyui.com/images/stock/photo-1507358522600-9f71e620c44e.jpg)'}}>
        <div className="hero-overlay bg-opacity-60"></div>
          <div className="hero-content text-center text-neutral-content">
            <div className="max-w-md">
              <h1 className="mb-5 text-5xl font-bold">Hello there</h1>
            <p className="mb-5">Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem quasi. In deleniti eaque aut repudiandae et a id nisi.</p>
          <Link className="btn btn-primary" href={"/products/" + products[0].id}>Get Started</Link>
        </div>
      </div>
    </div>
    }
    <div className='flex flex-col'>
    <div className='my-4 grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3'>
      {(currentPage === 1 ? products.slice(1) : products).map((products) =>(
        <ProductCard product={products} key={products.id}/>
      ))}
      </div>
      {totalPages > 1 && (
        <PaginationBar currentPage={currentPage} totalPages={totalPages} />)}
    
    </div>
    </div>
  )
}
