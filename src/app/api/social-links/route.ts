// app/api/social-links/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

// GET social links
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('social_links')
      .select('*')
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching social links:', error);
    }

    // Default links if none exist
    const defaultLinks = {
      whatsapp: "https://wa.me/1234567890",
      instagram: "https://instagram.com/yourbrand",
      contact: "tel:+1234567890"
    };

    return NextResponse.json(data || defaultLinks);
  } catch (error) {
    console.error('Error in social links API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// UPDATE social links (admin only)
export async function PUT(request: NextRequest) {
  try {
    // Verify admin (you'll need to implement proper admin verification)
    const { platform, link } = await request.json();

    const { data, error } = await supabase
      .from('social_links')
      .upsert({ 
        id: 1, 
        [platform]: link,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Error updating social links:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in social links update API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}