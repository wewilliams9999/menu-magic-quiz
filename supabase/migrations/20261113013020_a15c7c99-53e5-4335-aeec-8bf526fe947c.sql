CREATE TABLE public.restaurants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  neighborhood text NOT NULL,
  vibe text NOT NULL DEFAULT '',
  known_for text NOT NULL DEFAULT '',
  noise text NOT NULL DEFAULT 'lively',
  parking text NOT NULL DEFAULT 'street',
  reservations boolean NOT NULL DEFAULT false,
  open_sunday boolean NOT NULL DEFAULT true,
  price text NOT NULL DEFAULT '$$',
  tags text[] NOT NULL DEFAULT '{}',
  menu_url text NOT NULL,
  reserve_url text,
  lat double precision,
  lng double precision,
  parking_notes jsonb NOT NULL DEFAULT '[]'::jsonb,
  parking_scouted_at timestamptz,
  status text NOT NULL DEFAULT 'active',
  link_health jsonb NOT NULL DEFAULT '{}'::jsonb,
  last_verified_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.restaurants TO anon, authenticated;
GRANT ALL ON public.restaurants TO service_role;
ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active restaurants" ON public.restaurants FOR SELECT TO anon, authenticated USING (status = 'active');
CREATE OR REPLACE FUNCTION public.update_updated_at_column() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;
CREATE TRIGGER restaurants_updated_at BEFORE UPDATE ON public.restaurants FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
INSERT INTO public.restaurants (name, neighborhood, vibe, known_for, noise, parking, reservations, open_sunday, price, tags, menu_url, reserve_url) VALUES
('Lockeland Table','East Nashville','Cozy neighborhood dining room','Wood-fired pizza and community hour','quiet','lot',true,false,'$$','{family,date,cozy}','https://www.lockelandtable.com','https://www.lockelandtable.com'),
('Margot Cafe & Bar','East Nashville','Candlelit French-Italian bistro','Seasonal menu and Sunday brunch','quiet','street',true,true,'$$$','{date,brunch,romantic,family}','https://www.margotcafe.com','https://www.margotcafe.com'),
('Peninsula','East Nashville','Moody, intimate Iberian kitchen','Tasting-style Spanish plates','quiet','street',true,false,'$$$','{date,romantic,cocktails}','https://www.peninsulanashville.com','https://www.peninsulanashville.com'),
('Butcher & Bee','East Nashville','Bright, buzzy Mediterranean','Whipped feta and shared plates','lively','lot',true,true,'$$','{brunch,friends,patio}','https://butcherandbee.com/nashville','https://butcherandbee.com/nashville'),
('Rolf and Daughters','Germantown','Industrial-chic pasta house','Handmade pasta','lively','street',true,true,'$$$','{date,friends,cocktails}','https://www.rolfanddaughters.com','https://www.rolfanddaughters.com'),
('City House','Germantown','Warm Southern-Italian','Belly ham pizza, Sunday supper','lively','lot',true,true,'$$','{family,date}','https://www.cityhousenashville.com','https://www.cityhousenashville.com'),
('Germantown Cafe','Germantown','Classic bistro with skyline views','Brunch and patio','quiet','lot',true,true,'$$','{family,brunch,patio}','https://www.germantowncafe.com','https://www.germantowncafe.com'),
('Henrietta Red','Germantown','Airy, light-filled oyster bar','Oysters and wood-fired veggies','lively','street',true,true,'$$$','{date,brunch,cocktails}','https://www.henriettared.com','https://www.henriettared.com'),
('Hattie B''s Hot Chicken','Midtown','Fast, loud, legendary','Hot chicken and cold beer','loud','lot',false,true,'$','{casual,"hot chicken",beer,friends}','https://hattieb.com',NULL),
('The Catbird Seat','Midtown','Chef''s counter theater','Tasting menu experience','quiet','valet',true,false,'$$$','{date,romantic,special}','https://www.thecatbirdseatrestaurant.com','https://www.thecatbirdseatrestaurant.com'),
('Bolton''s Spicy Chicken & Fish','East Nashville','No-frills hot chicken shack','Spicy fried fish and chicken','lively','lot',false,false,'$','{casual,"hot chicken"}','https://boltonsspicy.com',NULL),
('Adele''s','The Gulch','Breezy garage-style dining room','Weekend brunch','lively','valet',true,true,'$$','{brunch,family,patio}','https://www.adelesnashville.com','https://www.adelesnashville.com'),
('Biscuit Love','The Gulch','Bustling brunch staple','Bonuts and biscuits','loud','street',false,true,'$','{brunch,casual,friends}','https://biscuitlove.com',NULL),
('Burger Up','12 South','Easygoing local burger joint','Local beef burgers','lively','street',false,true,'$','{casual,beer,family}','https://www.burger-up.com',NULL),
('Urban Grub','12 South','Polished patio steak and seafood','Oysters and steaks on the patio','lively','valet',true,true,'$$$','{date,patio,cocktails,brunch}','https://www.urbangrub.net','https://www.urbangrub.net');