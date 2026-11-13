# Content and launch notes

## Builds

| Command | What it shows |
| --- | --- |
| `npm run dev` | Everything, including sample content |
| `NEXT_PUBLIC_SHOW_SAMPLES=1 npm run build` | A client preview, with sample content |
| `npm run build` | The launch build: only content the firm has supplied |

Other environment variables:

- `NEXT_PUBLIC_SITE_URL`: the public address, used for canonical links and `sitemap.xml`.
- `NEXT_PUBLIC_FORMS_ENDPOINT`: receives the enquiry, subscription and application forms. Without it, production forms show an error instead of dropping messages.

## The firm still to supply

Every value below is marked `FIRM TO SUPPLY` in `src/content/`.

- **Firm details** (`firm.ts`): street address, telephone, email, hours, practising statement, and the wording of the enquiry notice and disclaimers. Anything left blank is not shown.
- **Lawyers** (`people.ts`): names, address slugs, roles, admissions, forums, languages, portraits, CVs, biographies, education and publications.
- **Representative matters** (`matters.ts`).
- **Insights** (`insights.ts`): until the dashboard exists.
- **Openings** (`careers.ts`).
- **Final wording** of the four legal notices (`legal.ts`) and of all French copy.
- **Site map decisions** 01 to 06, in particular the Investigations qualifying line and the registered firm name.

Practice-area copy, About, Careers and the legal notices are first drafts written for the firm's approval.

## Photography

Photographs in `public/images/` are from Unsplash, under the Unsplash Licence (free for commercial use; no attribution required). They can be swapped for the firm's own photographs at the same paths.

| File | Unsplash photo |
| --- | --- |
| nairobi-night.jpg | Zkao_QBEjk8 |
| nairobi-skyline.jpg | LTh5pGyvKAM |
| nairobi-kicc.jpg | vyagy6HJpVE |
| boardroom.jpg | 0sT9YhNgSEs |
| tower.jpg | g6yEpOJ7M7k |
| office-night.jpg | io5clS15h9Q |
| energy.jpg | MXzs0BSSPHc |
| port.jpg | sWOvgOOFk1g |
| columns.jpg | Dv53wYJ0z_s |
| library.jpg | CyMGg5QoyLw |
| peace-palace.jpg | wAaDzrEvYts |
| meeting-room.jpg | GWe0dlVD9e0 |

Each one is at `https://unsplash.com/photos/<id>`.

Lawyer portraits are deliberately not stock photography. A neutral plate appears until the firm's portraits arrive.
