import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/auth/get-user";
import { getPartner, createPartner } from "@/lib/actions/partners";
import { PartnerCMS } from "@/app/components/portal/partner-cms";

function nameFromSlug(slug: string) {
  return slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

export default async function PartnerEditPage({ params }: { params: Promise<{ slug: string }> }) {
  const user = await getAuthUser();
  if (!user) redirect("/member/login");

  const { slug } = await params;
  let partner = await getPartner(slug);

  // If no DB record yet, create one so the partner can start editing
  if (!partner) {
    const id = await createPartner({
      slug: slug,
      name: nameFromSlug(slug),
      restaurant_type: "casual",
      city: "New York",
    });
    partner = await getPartner(id);
  }

  if (!partner) {
    return (
      <div style={{ padding: 40, textAlign: "center", fontFamily: "sans-serif" }}>
        <p>Could not load partner page. Please try again.</p>
      </div>
    );
  }

  // Gate: only the owner can edit (once an owner is set)
  if (partner.owner_id && partner.owner_id !== user.id) {
    redirect("/member/city");
  }

  return <PartnerCMS partner={partner}/>;
}
