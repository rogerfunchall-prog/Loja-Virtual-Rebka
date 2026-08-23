import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Category = {
  id: string;
  slug: string;
  name: string;
  image_url: string | null;
  position: number;
};

export type Brand = {
  id: string;
  name: string;
  logo_url: string;
  position: number;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  compare_at_price: number | null;
  image_url: string;
  category_id: string | null;
  brand_id: string | null;
  stock: number;
  free_shipping: boolean;
  is_best_seller: boolean;
  is_favorite: boolean;
  is_last_chance: boolean;
  position: number;
};

export type Banner = {
  id: string;
  kind: string;
  title: string | null;
  image_url: string;
  mobile_image_url: string | null;
  link: string | null;
  position: number;
};

export type Testimonial = {
  id: string;
  name: string;
  avatar_url: string;
  content: string;
  rating: number;
  position: number;
};

export type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image_url: string;
  published_at: string;
};

function unwrap<T>(res: { data: T | null; error: { message: string } | null }): T {
  if (res.error) throw new Error(res.error.message);
  return (res.data ?? []) as T;
}

export const categoriesQuery = queryOptions({
  queryKey: ["categories"],
  queryFn: async () =>
    unwrap<Category[]>(
      await supabase.from("categories").select("*").order("position"),
    ),
});

export const brandsQuery = queryOptions({
  queryKey: ["brands"],
  queryFn: async () =>
    unwrap<Brand[]>(await supabase.from("brands").select("*").order("position")),
});

export const productsQuery = queryOptions({
  queryKey: ["products"],
  queryFn: async () =>
    unwrap<Product[]>(
      await supabase.from("products").select("*").order("position"),
    ),
});

export const bannersQuery = queryOptions({
  queryKey: ["banners"],
  queryFn: async () =>
    unwrap<Banner[]>(await supabase.from("banners").select("*").order("position")),
});

export const testimonialsQuery = queryOptions({
  queryKey: ["testimonials"],
  queryFn: async () =>
    unwrap<Testimonial[]>(
      await supabase.from("testimonials").select("*").order("position"),
    ),
});

export const postsQuery = queryOptions({
  queryKey: ["posts"],
  queryFn: async () =>
    unwrap<Post[]>(
      await supabase.from("posts").select("*").order("published_at", { ascending: false }),
    ),
});
