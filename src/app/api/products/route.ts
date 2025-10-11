import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')

  try {
    let query = supabaseServer
      .from('products')
      .select(`
        *,
        categories!inner(name, slug),
        product_variants(*),
        product_images(*)
      `)
      .order('created_at', { ascending: false })

    if (category) {
      query = query.eq('categories.slug', category)
    }

    const { data, error } = await query

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data || [])
  } catch (err) {
    console.error('Server error:', err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}