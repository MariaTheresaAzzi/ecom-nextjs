import { prisma } from "@/lib/db/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import PriceTag from "@/components/PriceTag";;
import { Metadata } from "next";
import {cache} from "react";
import AddTocartButton from "./AddToCartButton";
import { incrementProductQuantity } from "./actions";

interface ProductPageProps {
    params:{
        id: string,
    }
}

export async function generateMetadata(
    {params: {id}} : ProductPageProps
): Promise<Metadata>{
    const product = await getProduct(id);

    return{
        title: product.name + "- barbie",
        description: product.description,
        openGraph: {
            images: [{ url: product.imageUrl}],
        },
    };
}

const getProduct = cache(async (id: string) =>{
    const product = await prisma.products.findUnique({where: {id}})
    if (!product) notFound();
    return product;
});

export default async function ProductPage(
    {params: {id}} : ProductPageProps
){
    const product = await getProduct(id);
    if (!product) notFound();
    return(
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
            <Image 
            src={product.imageUrl}
            alt={product.name}
            width={500}
            height={500}
            className="rounded-lg"
            priority/>
            <div>
                <h1 className="text-5xl font-bold">{product.name}</h1>
                <PriceTag price={product.price} className="mt-4"/>
                <p className="py-6">{product.description}</p>
                <AddTocartButton productId={product.id} incrementProductQuantity={incrementProductQuantity}/>
            </div>
        </div>
    );
}