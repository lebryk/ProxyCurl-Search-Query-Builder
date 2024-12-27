--
-- PostgreSQL database dump
--

-- Dumped from database version 15.6
-- Dumped by pg_dump version 16.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: pg_database_owner
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO pg_database_owner;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: pg_database_owner
--

COMMENT ON SCHEMA public IS 'standard public schema';


--
-- Name: company_role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.company_role AS ENUM (
    'owner',
    'admin',
    'member'
);


ALTER TYPE public.company_role OWNER TO postgres;

--
-- Name: get_profile_json(text[]); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_profile_json(p_profile_ids text[]) RETURNS json
    LANGUAGE plpgsql
    AS $$
DECLARE
    json_result JSON;
BEGIN
    -- Build the JSON structure for multiple profiles
    json_result := json_build_object(
        'next_page', NULL,
        'results', (
            SELECT json_agg(
                json_build_object(
                    'last_updated', to_char(now(), 'YYYY-MM-DD"T"HH24:MI:SS"Z"'),
                    'linkedin_profile_url', main_p.id,
                    'profile', json_build_object(
                        'public_identifier', main_p.id, -- Not stored in db
                        'profile_pic_url', main_p.profile_pic_url,
                        'background_cover_image_url', main_p.background_cover_image_url,
                        'first_name', main_p.first_name,
                        'last_name', main_p.last_name,
                        'full_name', main_p.first_name || ' ' || main_p.last_name,
                        'follower_count', main_p.follower_count,
                        'occupation', main_p.occupation,
                        'headline', main_p.headline,
                        'summary', main_p.summary,
                        'country', main_p.country,
                        'country_full_name', main_p.country_full_name,
                        'city', main_p.city,
                        'state', main_p.state,
                        'connections', main_p.connections,
                        
                        -- Experiences
                        'experiences', (
                            SELECT json_agg(
                                json_build_object(
                                    'starts_at', CASE 
                                        WHEN pe.starts_at IS NOT NULL THEN json_build_object(
                                            'day', EXTRACT(DAY FROM to_timestamp(pe.starts_at)),
                                            'month', EXTRACT(MONTH FROM to_timestamp(pe.starts_at)),
                                            'year', EXTRACT(YEAR FROM to_timestamp(pe.starts_at))
                                        )
                                        ELSE NULL 
                                    END,
                                    'ends_at', CASE 
                                        WHEN pe.ends_at IS NOT NULL THEN json_build_object(
                                            'day', EXTRACT(DAY FROM to_timestamp(pe.ends_at)),
                                            'month', EXTRACT(MONTH FROM to_timestamp(pe.ends_at)),
                                            'year', EXTRACT(YEAR FROM to_timestamp(pe.ends_at))
                                        )
                                        ELSE NULL 
                                    END,
                                    'company', pe.company,
                                    'company_linkedin_profile_url', pe.company_profile_url,
                                    'company_facebook_profile_url', NULL, -- Not stored in the database
                                    'title', pe.title,
                                    'description', pe.description,
                                    'location', pe.location,
                                    'logo_url', pe.logo_url,
                                    'company_urn', pe.company_urn,
                                    'normalized_company', pe.normalized_company
                                )
                            )
                            FROM public.profile_experience pe
                            WHERE pe.profile_id = main_p.id
                        ),
                        
                        -- Education
                        'education', (
                            SELECT json_agg(
                                json_build_object(
                                    'starts_at', CASE 
                                        WHEN pe.starts_at IS NOT NULL THEN json_build_object(
                                            'day', EXTRACT(DAY FROM to_timestamp(pe.starts_at)),
                                            'month', EXTRACT(MONTH FROM to_timestamp(pe.starts_at)),
                                            'year', EXTRACT(YEAR FROM to_timestamp(pe.starts_at))
                                        )
                                        ELSE NULL 
                                    END,
                                    'ends_at', CASE 
                                        WHEN pe.ends_at IS NOT NULL THEN json_build_object(
                                            'day', EXTRACT(DAY FROM to_timestamp(pe.ends_at)),
                                            'month', EXTRACT(MONTH FROM to_timestamp(pe.ends_at)),
                                            'year', EXTRACT(YEAR FROM to_timestamp(pe.ends_at))
                                        )
                                        ELSE NULL 
                                    END,
                                    'field_of_study', pe.field_of_study,
                                    'degree_name', pe.degree_name,
                                    'school', pe.school,
                                    'school_linkedin_profile_url', pe.school_profile_url,
                                    'school_facebook_profile_url', NULL, -- Not stored
                                    'description', pe.description,
                                    'logo_url', pe.logo_url,
                                    'grade', pe.grade,
                                    'activities_and_societies', pe.activities_and_societies
                                )
                            )
                            FROM public.profile_education pe
                            WHERE pe.profile_id = main_p.id
                        ),
                        
                        -- Languages and Proficiencies
                        'languages_and_proficiencies', (
                            SELECT json_agg(
                                json_build_object(
                                    'name', pl.name,
                                    'proficiency', pl.proficiency
                                )
                            )
                            FROM public.profile_language pl
                            WHERE pl.profile_id = main_p.id
                        ),
                        
                        -- Accomplishment Organisations
                        'accomplishment_organisations', (
                            SELECT json_agg(
                                json_build_object(
                                    'starts_at', CASE 
                                        WHEN po.starts_at IS NOT NULL THEN json_build_object(
                                            'day', EXTRACT(DAY FROM to_timestamp(po.starts_at)),
                                            'month', EXTRACT(MONTH FROM to_timestamp(po.starts_at)),
                                            'year', EXTRACT(YEAR FROM to_timestamp(po.starts_at))
                                        )
                                        ELSE NULL 
                                    END,
                                    'ends_at', CASE 
                                        WHEN po.ends_at IS NOT NULL THEN json_build_object(
                                            'day', EXTRACT(DAY FROM to_timestamp(po.ends_at)),
                                            'month', EXTRACT(MONTH FROM to_timestamp(po.ends_at)),
                                            'year', EXTRACT(YEAR FROM to_timestamp(po.ends_at))
                                        )
                                        ELSE NULL 
                                    END,
                                    'name', po.name,
                                    'title', po.title,
                                    'description', po.description
                                )
                            )
                            FROM public.profile_organization po
                            WHERE po.profile_id = main_p.id
                        ),
                        
                        -- Accomplishment Publications
                        'accomplishment_publications', (
                            SELECT json_agg(
                                json_build_object(
                                    'name', ppub.name,
                                    'publisher', ppub.publisher,
                                    'published_date', CASE 
                                        WHEN ppub.published_on IS NOT NULL THEN json_build_object(
                                            'day', EXTRACT(DAY FROM to_timestamp(ppub.published_on)),
                                            'month', EXTRACT(MONTH FROM to_timestamp(ppub.published_on)),
                                            'year', EXTRACT(YEAR FROM to_timestamp(ppub.published_on))
                                        )
                                        ELSE NULL 
                                    END,
                                    'description', ppub.description,
                                    'url', ppub.url
                                )
                            )
                            FROM public.profile_publication ppub
                            WHERE ppub.profile_id = main_p.id
                        ),
                        
                        -- Accomplishment Honors Awards
                        'accomplishment_honors_awards', (
                            SELECT json_agg(
                                json_build_object(
                                    'title', pha.title,
                                    'issuer', pha.issuer,
                                    'issued_on', CASE 
                                        WHEN pha.issued_on IS NOT NULL THEN json_build_object(
                                            'day', EXTRACT(DAY FROM to_timestamp(pha.issued_on)),
                                            'month', EXTRACT(MONTH FROM to_timestamp(pha.issued_on)),
                                            'year', EXTRACT(YEAR FROM to_timestamp(pha.issued_on))
                                        )
                                        ELSE NULL 
                                    END,
                                    'description', pha.description
                                )
                            )
                            FROM public.profile_honour_award pha
                            WHERE pha.profile_id = main_p.id
                        ),
                        
                        -- Accomplishment Patents (Empty Array as the table is empty)
                        'accomplishment_patents', json_build_array(),
                        
                        -- Accomplishment Courses
                        'accomplishment_courses', (
                            SELECT json_agg(
                                json_build_object(
                                    'name', pc.name,
                                    'number', pc.number
                                )
                            )
                            FROM public.profile_course pc
                            WHERE pc.profile_id = main_p.id
                        ),
                        
                        -- Accomplishment Projects
                        'accomplishment_projects', (
                            SELECT json_agg(
                                json_build_object(
                                    'title', pp.title,
                                    'description', pp.description,
                                    'url', pp.url,
                                    'starts_at', CASE 
                                        WHEN pp.starts_at IS NOT NULL THEN json_build_object(
                                            'day', EXTRACT(DAY FROM to_timestamp(pp.starts_at)),
                                            'month', EXTRACT(MONTH FROM to_timestamp(pp.starts_at)),
                                            'year', EXTRACT(YEAR FROM to_timestamp(pp.starts_at))
                                        )
                                        ELSE NULL 
                                    END,
                                    'ends_at', CASE 
                                        WHEN pp.ends_at IS NOT NULL THEN json_build_object(
                                            'day', EXTRACT(DAY FROM to_timestamp(pp.ends_at)),
                                            'month', EXTRACT(MONTH FROM to_timestamp(pp.ends_at)),
                                            'year', EXTRACT(YEAR FROM to_timestamp(pp.ends_at))
                                        )
                                        ELSE NULL 
                                    END
                                )
                            )
                            FROM public.profile_project pp
                            WHERE pp.profile_id = main_p.id
                        ),
                        
                        -- Accomplishment Test Scores
                        'accomplishment_test_scores', (
                            SELECT json_agg(
                                json_build_object(
                                    'name', pts.name,
                                    'score', pts.score,
                                    'date_on', CASE 
                                        WHEN pts.date_on IS NOT NULL THEN json_build_object(
                                            'day', EXTRACT(DAY FROM to_timestamp(pts.date_on)),
                                            'month', EXTRACT(MONTH FROM to_timestamp(pts.date_on)),
                                            'year', EXTRACT(YEAR FROM to_timestamp(pts.date_on))
                                        )
                                        ELSE NULL 
                                    END,
                                    'description', pts.description
                                )
                            )
                            FROM public.profile_test_score pts
                            WHERE pts.profile_id = main_p.id
                        ),
                        
                        -- Volunteer Work
                        'volunteer_work', (
                            SELECT json_agg(
                                json_build_object(
                                    'starts_at', CASE 
                                        WHEN pve.starts_at IS NOT NULL THEN json_build_object(
                                            'day', EXTRACT(DAY FROM to_timestamp(pve.starts_at)),
                                            'month', EXTRACT(MONTH FROM to_timestamp(pve.starts_at)),
                                            'year', EXTRACT(YEAR FROM to_timestamp(pve.starts_at))
                                        )
                                        ELSE NULL 
                                    END,
                                    'ends_at', CASE 
                                        WHEN pve.ends_at IS NOT NULL THEN json_build_object(
                                            'day', EXTRACT(DAY FROM to_timestamp(pve.ends_at)),
                                            'month', EXTRACT(MONTH FROM to_timestamp(pve.ends_at)),
                                            'year', EXTRACT(YEAR FROM to_timestamp(pve.ends_at))
                                        )
                                        ELSE NULL 
                                    END,
                                    'cause', pve.cause,
                                    'company', pve.company,
                                    'company_linkedin_profile_url', pve.company_profile_url,
                                    'title', pve.title,
                                    'description', pve.description,
                                    'logo_url', pve.logo_url
                                )
                            )
                            FROM public.profile_volunteering_experience pve
                            WHERE pve.profile_id = main_p.id
                        ),
                        
                        -- People Also Viewed
                        'people_also_viewed', (
                            SELECT json_agg(
                                json_build_object(
                                    'link', ppv.link,
                                    'name', ppv.name,
                                    'summary', ppv.summary,
                                    'location', ppv.location
                                )
                            )
                            FROM public.profile_people_also_viewed ppv
                            WHERE ppv.profile_id = main_p.id
                        ),
                        
                        -- Recommendations
                        'recommendations', (
                            SELECT json_agg(pr.content)
                            FROM public.profile_recommendation pr
                            WHERE pr.profile_id = main_p.id
                        ),
                        
                        -- Similarly Named Profiles
                        'similarly_named_profiles', (
                            SELECT json_agg(
                                json_build_object(
                                    'name', psn.name,
                                    'link', psn.link,
                                    'summary', psn.summary,
                                    'location', psn.location
                                )
                            )
                            FROM public.profile_similar_named psn
                            WHERE psn.profile_id = main_p.id
                        ),
                        
                        -- Articles
                        'articles', (
                            SELECT json_agg(
                                json_build_object(
                                    'title', pa.title,
                                    'link', pa.link,
                                    'published_date', CASE 
                                        WHEN pa.published_date IS NOT NULL THEN json_build_object(
                                            'day', EXTRACT(DAY FROM to_timestamp(pa.published_date)),
                                            'month', EXTRACT(MONTH FROM to_timestamp(pa.published_date)),
                                            'year', EXTRACT(YEAR FROM to_timestamp(pa.published_date))
                                        )
                                        ELSE NULL 
                                    END,
                                    'author', pa.author,
                                    'image_url', pa.image_url
                                )
                            )
                            FROM public.profile_article pa
                            WHERE pa.profile_id = main_p.id
                        ),
                        
                        -- Groups
                        'groups', (
                            SELECT json_agg(
                                json_build_object(
                                    'profile_pic_url', pg.profile_pic_url,
                                    'name', pg.name,
                                    'url', pg.url
                                )
                            )
                            FROM public.profile_group pg
                            WHERE pg.profile_id = main_p.id
                        ),
                        
                        -- Certifications
                        'certifications', (
                            SELECT json_agg(
                                json_build_object(
                                    'starts_at', CASE 
                                        WHEN pc.starts_at IS NOT NULL THEN json_build_object(
                                            'day', EXTRACT(DAY FROM to_timestamp(pc.starts_at)),
                                            'month', EXTRACT(MONTH FROM to_timestamp(pc.starts_at)),
                                            'year', EXTRACT(YEAR FROM to_timestamp(pc.starts_at))
                                        )
                                        ELSE NULL 
                                    END,
                                    'ends_at', CASE 
                                        WHEN pc.ends_at IS NOT NULL THEN json_build_object(
                                            'day', EXTRACT(DAY FROM to_timestamp(pc.ends_at)),
                                            'month', EXTRACT(MONTH FROM to_timestamp(pc.ends_at)),
                                            'year', EXTRACT(YEAR FROM to_timestamp(pc.ends_at))
                                        )
                                        ELSE NULL 
                                    END,
                                    'url', pc.url,
                                    'name', pc.name,
                                    'license_number', pc.license_number,
                                    'display_source', pc.display_source,
                                    'authority', pc.authority
                                )
                            )
                            FROM public.profile_certification pc
                            WHERE pc.profile_id = main_p.id
                        )
                    )
                )
            )
            FROM public.profile main_p
            WHERE main_p.id = ANY(p_profile_ids)
        ),
        'total_result_count', (
            SELECT COUNT(*)
            FROM public.profile
            WHERE id = ANY(p_profile_ids)
        )
    );

    RETURN json_result;
END;
$$;


ALTER FUNCTION public.get_profile_json(p_profile_ids text[]) OWNER TO postgres;

--
-- Name: handle_new_company(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.handle_new_company() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
    INSERT INTO company_members (company_id, user_id, role)
    VALUES (NEW.id, auth.uid(), 'owner');
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.handle_new_company() OWNER TO postgres;

--
-- Name: handle_new_user(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.handle_new_user() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
begin
  insert into public.profiles (id, first_name, last_name)
  values (new.id, '', '');
  return new;
end;
$$;


ALTER FUNCTION public.handle_new_user() OWNER TO postgres;

--
-- Name: insert_profiles(json); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.insert_profiles(profiles json) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
    profile_record JSON;
    activity JSON;
    article JSON;
    certification JSON;
    course JSON;
    education_record JSON;
    experience_record JSON;
    group_json JSON;
    honour_award JSON;
    language JSON;
    organization JSON;
    people_also_viewed JSON;
    project JSON;
    publication JSON;
    recommendation TEXT;
    similar_named JSON;
    test_score JSON;
    volunteering_experience JSON;

    -- Date variables
    published_date_epoch DOUBLE PRECISION;
    issued_on_epoch DOUBLE PRECISION;
    pub_date_epoch DOUBLE PRECISION;
    ts_date_epoch DOUBLE PRECISION;
    starts_at_epoch DOUBLE PRECISION;
    ends_at_epoch DOUBLE PRECISION;
    edu_start_epoch DOUBLE PRECISION;
    edu_end_epoch DOUBLE PRECISION;
    exp_start_epoch DOUBLE PRECISION;
    exp_end_epoch DOUBLE PRECISION;
    proj_start_epoch DOUBLE PRECISION;
    proj_end_epoch DOUBLE PRECISION;
    vol_start_epoch DOUBLE PRECISION;
    vol_end_epoch DOUBLE PRECISION;
    org_start_epoch DOUBLE PRECISION;
    org_end_epoch DOUBLE PRECISION;

BEGIN
    -- Iterate over each profile in the 'results' array
    FOR profile_record IN
        SELECT * FROM json_array_elements(profiles -> 'results') AS p
    LOOP
        -- Extract profile_id from linkedin_profile_url
        DECLARE
            p_profile_id TEXT := profile_record -> 'profile' ->> 'public_identifier';
        BEGIN
            -- Upsert into public.profile
            INSERT INTO public.profile (
                id,
                profile_pic_url,
                city,
                country,
                first_name,
                headline,
                last_name,
                state,
                summary,
                background_cover_image_url,
                connections,
                country_full_name,
                occupation,
                crawler_name,
                follower_count
            ) VALUES (
                p_profile_id,
                profile_record -> 'profile' ->> 'profile_pic_url',
                profile_record -> 'profile' ->> 'city',
                profile_record -> 'profile' ->> 'country',
                profile_record -> 'profile' ->> 'first_name',
                profile_record -> 'profile' ->> 'headline',
                profile_record -> 'profile' ->> 'last_name',
                profile_record -> 'profile' ->> 'state',
                profile_record -> 'profile' ->> 'summary',
                profile_record -> 'profile' ->> 'background_cover_image_url',
                COALESCE(NULLIF(profile_record -> 'profile' ->> 'connections', '')::INTEGER, 0),
                profile_record -> 'profile' ->> 'country_full_name',
                profile_record -> 'profile' ->> 'occupation',
                NULL, -- crawler_name is not provided in JSON
                COALESCE(NULLIF(profile_record -> 'profile' ->> 'follower_count', '')::INTEGER, 0)
            )
            ON CONFLICT (id) DO UPDATE SET
                profile_pic_url = EXCLUDED.profile_pic_url,
                city = EXCLUDED.city,
                country = EXCLUDED.country,
                first_name = EXCLUDED.first_name,
                headline = EXCLUDED.headline,
                last_name = EXCLUDED.last_name,
                state = EXCLUDED.state,
                summary = EXCLUDED.summary,
                background_cover_image_url = EXCLUDED.background_cover_image_url,
                connections = EXCLUDED.connections,
                country_full_name = EXCLUDED.country_full_name,
                occupation = EXCLUDED.occupation,
                crawler_name = EXCLUDED.crawler_name,
                follower_count = EXCLUDED.follower_count;

            -- Upsert into profile_activity
            IF profile_record -> 'profile' -> 'activities' IS NOT NULL THEN
                FOR activity IN
                    SELECT * FROM json_array_elements(profile_record -> 'profile' -> 'activities') AS a
                LOOP
                    INSERT INTO public.profile_activity (
                        title,
                        link,
                        activity_status,
                        profile_id
                    ) VALUES (
                        activity ->> 'title',
                        activity ->> 'link',
                        activity ->> 'activity_status',
                        p_profile_id
                    )
                    ON CONFLICT (profile_id, title) DO UPDATE SET
                        link = EXCLUDED.link,
                        activity_status = EXCLUDED.activity_status;
                END LOOP;
            END IF;

            -- Upsert into profile_article
            IF profile_record -> 'profile' -> 'articles' IS NOT NULL THEN
                FOR article IN
                    SELECT * FROM json_array_elements(profile_record -> 'profile' -> 'articles') AS a
                LOOP
                    IF article -> 'published_date' IS NOT NULL THEN
                        BEGIN
                            published_date_epoch := (
                                (article -> 'published_date' ->> 'year') || '-' ||
                                LPAD(article -> 'published_date' ->> 'month', 2, '0') || '-' ||
                                LPAD(article -> 'published_date' ->> 'day', 2, '0')
                            )::DATE;
                            published_date_epoch := EXTRACT(EPOCH FROM published_date_epoch);
                        EXCEPTION WHEN OTHERS THEN
                            published_date_epoch := NULL;
                        END;
                    ELSE
                        published_date_epoch := NULL;
                    END IF;

                    INSERT INTO public.profile_article (
                        title,
                        link,
                        published_date,
                        author,
                        image_url,
                        profile_id
                    ) VALUES (
                        article ->> 'title',
                        article ->> 'link',
                        published_date_epoch,
                        article ->> 'author',
                        article ->> 'image_url',
                        p_profile_id
                    )
                    ON CONFLICT (profile_id, link) DO UPDATE SET
                        title = EXCLUDED.title,
                        published_date = EXCLUDED.published_date,
                        author = EXCLUDED.author,
                        image_url = EXCLUDED.image_url;
                END LOOP;
            END IF;

            -- Upsert into profile_certification
            IF profile_record -> 'profile' -> 'certifications' IS NOT NULL THEN
                FOR certification IN
                    SELECT * FROM json_array_elements(profile_record -> 'profile' -> 'certifications') AS c
                LOOP
                    -- Handle starts_at
                    IF certification -> 'starts_at' IS NOT NULL THEN
                        BEGIN
                            starts_at_epoch := (
                                (certification -> 'starts_at' ->> 'year') || '-' ||
                                LPAD(certification -> 'starts_at' ->> 'month', 2, '0') || '-' ||
                                LPAD(certification -> 'starts_at' ->> 'day', 2, '0')
                            )::DATE;
                            starts_at_epoch := EXTRACT(EPOCH FROM starts_at_epoch);
                        EXCEPTION WHEN OTHERS THEN
                            starts_at_epoch := NULL;
                        END;
                    ELSE
                        starts_at_epoch := NULL;
                    END IF;

                    -- Handle ends_at
                    IF certification -> 'ends_at' IS NOT NULL THEN
                        BEGIN
                            ends_at_epoch := (
                                (certification -> 'ends_at' ->> 'year') || '-' ||
                                LPAD(certification -> 'ends_at' ->> 'month', 2, '0') || '-' ||
                                LPAD(certification -> 'ends_at' ->> 'day', 2, '0')
                            )::DATE;
                            ends_at_epoch := EXTRACT(EPOCH FROM ends_at_epoch);
                        EXCEPTION WHEN OTHERS THEN
                            ends_at_epoch := NULL;
                        END;
                    ELSE
                        ends_at_epoch := NULL;
                    END IF;

                    INSERT INTO public.profile_certification (
                        starts_at,
                        ends_at,
                        url,
                        name,
                        license_number,
                        display_source,
                        authority,
                        profile_id
                    ) VALUES (
                        starts_at_epoch,
                        ends_at_epoch,
                        certification ->> 'url',
                        certification ->> 'name',
                        certification ->> 'license_number',
                        certification ->> 'display_source',
                        certification ->> 'authority',
                        p_profile_id
                    )
                    ON CONFLICT (profile_id, name, license_number) DO UPDATE SET
                        starts_at = EXCLUDED.starts_at,
                        ends_at = EXCLUDED.ends_at,
                        url = EXCLUDED.url,
                        display_source = EXCLUDED.display_source,
                        authority = EXCLUDED.authority;
                        
                END LOOP;
            END IF;

            -- Upsert into profile_course
            IF profile_record -> 'profile' -> 'accomplishment_courses' IS NOT NULL THEN
                FOR course IN
                    SELECT * FROM json_array_elements(profile_record -> 'profile' -> 'accomplishment_courses') AS c
                LOOP
                    INSERT INTO public.profile_course (
                        name,
                        number,
                        profile_id
                    ) VALUES (
                        course ->> 'name',
                        course ->> 'number',
                        p_profile_id
                    )
                    ON CONFLICT (profile_id, name) DO UPDATE SET
                        number = EXCLUDED.number;
                END LOOP;
            END IF;

            -- Upsert into profile_education
            IF profile_record -> 'profile' -> 'education' IS NOT NULL THEN
                FOR education_record IN
                    SELECT * FROM json_array_elements(profile_record -> 'profile' -> 'education') AS e
                LOOP
                    -- Handle starts_at
                    IF education_record -> 'starts_at' IS NOT NULL THEN
                        BEGIN
                            edu_start_epoch := (
                                (education_record -> 'starts_at' ->> 'year') || '-' ||
                                LPAD(education_record -> 'starts_at' ->> 'month', 2, '0') || '-' ||
                                LPAD(education_record -> 'starts_at' ->> 'day', 2, '0')
                            )::DATE;
                            edu_start_epoch := EXTRACT(EPOCH FROM edu_start_epoch);
                        EXCEPTION WHEN OTHERS THEN
                            edu_start_epoch := NULL;
                        END;
                    ELSE
                        edu_start_epoch := NULL;
                    END IF;

                    -- Handle ends_at
                    IF education_record -> 'ends_at' IS NOT NULL THEN
                        BEGIN
                            edu_end_epoch := (
                                (education_record -> 'ends_at' ->> 'year') || '-' ||
                                LPAD(education_record -> 'ends_at' ->> 'month', 2, '0') || '-' ||
                                LPAD(education_record -> 'ends_at' ->> 'day', 2, '0')
                            )::DATE;
                            edu_end_epoch := EXTRACT(EPOCH FROM edu_end_epoch);
                        EXCEPTION WHEN OTHERS THEN
                            edu_end_epoch := NULL;
                        END;
                    ELSE
                        edu_end_epoch := NULL;
                    END IF;

                    INSERT INTO public.profile_education (
                        starts_at,
                        ends_at,
                        field_of_study,
                        degree_name,
                        school,
                        school_profile_url,
                        description,
                        logo_url,
                        grade,
                        activities_and_societies,
                        profile_id
                    ) VALUES (
                        edu_start_epoch,
                        edu_end_epoch,
                        education_record ->> 'field_of_study',
                        education_record ->> 'degree_name',
                        education_record ->> 'school',
                        education_record ->> 'school_linkedin_profile_url',
                        education_record ->> 'description',
                        education_record ->> 'logo_url',
                        education_record ->> 'grade',
                        education_record ->> 'activities_and_societies',
                        p_profile_id
                    )
                    ON CONFLICT (profile_id, school, degree_name) DO UPDATE SET
                        starts_at = EXCLUDED.starts_at,
                        ends_at = EXCLUDED.ends_at,
                        field_of_study = EXCLUDED.field_of_study,
                        
                        logo_url = EXCLUDED.logo_url,
                        grade = EXCLUDED.grade,
                        activities_and_societies = EXCLUDED.activities_and_societies;
                END LOOP;
            END IF;

            -- Upsert into profile_experience
            IF profile_record -> 'profile' -> 'experiences' IS NOT NULL THEN
                FOR experience_record IN
                    SELECT * FROM json_array_elements(profile_record -> 'profile' -> 'experiences') AS e
                LOOP
                    -- Handle starts_at
                    IF experience_record -> 'starts_at' IS NOT NULL THEN
                        BEGIN
                            exp_start_epoch := (
                                (experience_record -> 'starts_at' ->> 'year') || '-' ||
                                LPAD(experience_record -> 'starts_at' ->> 'month', 2, '0') || '-' ||
                                LPAD(experience_record -> 'starts_at' ->> 'day', 2, '0')
                            )::DATE;
                            exp_start_epoch := EXTRACT(EPOCH FROM exp_start_epoch);
                        EXCEPTION WHEN OTHERS THEN
                            exp_start_epoch := NULL;
                        END;
                    ELSE
                        exp_start_epoch := NULL;
                    END IF;

                    -- Handle ends_at
                    IF experience_record -> 'ends_at' IS NOT NULL THEN
                        BEGIN
                            exp_end_epoch := (
                                (experience_record -> 'ends_at' ->> 'year') || '-' ||
                                LPAD(experience_record -> 'ends_at' ->> 'month', 2, '0') || '-' ||
                                LPAD(experience_record -> 'ends_at' ->> 'day', 2, '0')
                            )::DATE;
                            exp_end_epoch := EXTRACT(EPOCH FROM exp_end_epoch);
                        EXCEPTION WHEN OTHERS THEN
                            exp_end_epoch := NULL;
                        END;
                    ELSE
                        exp_end_epoch := NULL;
                    END IF;

                    INSERT INTO public.profile_experience (
                        starts_at,
                        ends_at,
                        company,
                        company_profile_url,
                        title,
                        location,
                        description,
                        logo_url,
                        profile_id
                    ) VALUES (
                        exp_start_epoch,
                        exp_end_epoch,
                        experience_record ->> 'company',
                        experience_record ->> 'company_linkedin_profile_url',
                        experience_record ->> 'title',
                        experience_record ->> 'location',
                        experience_record ->> 'description',
                        experience_record ->> 'logo_url',
                        p_profile_id
                    )
                    ON CONFLICT (profile_id, company, title) DO UPDATE SET
                        starts_at = EXCLUDED.starts_at,
                        ends_at = EXCLUDED.ends_at,
                        company_profile_url = EXCLUDED.company_profile_url,
                        location = EXCLUDED.location,
                        
                        logo_url = EXCLUDED.logo_url;
                END LOOP;
            END IF;

            -- Upsert into profile_group
            IF profile_record -> 'profile' -> 'groups' IS NOT NULL THEN
                FOR group_json IN
                    SELECT * FROM json_array_elements(profile_record -> 'profile' -> 'groups') AS g
                LOOP
                    INSERT INTO public.profile_group (
                        profile_pic_url,
                        name,
                        url,
                        profile_id
                    ) VALUES (
                        group_json ->> 'profile_pic_url',
                        group_json ->> 'name',
                        group_json ->> 'url',
                        p_profile_id
                    )
                    ON CONFLICT (profile_id, name) DO UPDATE SET
                        profile_pic_url = EXCLUDED.profile_pic_url,
                        url = EXCLUDED.url;
                END LOOP;
            END IF;

            -- Upsert into profile_honour_award
            IF profile_record -> 'profile' -> 'accomplishment_honors_awards' IS NOT NULL THEN
                FOR honour_award IN
                    SELECT * FROM json_array_elements(profile_record -> 'profile' -> 'accomplishment_honors_awards') AS a
                LOOP
                    -- Handle issued_on
                    IF honour_award -> 'issued_on' IS NOT NULL THEN
                        BEGIN
                            issued_on_epoch := (
                                (honour_award -> 'issued_on' ->> 'year') || '-' ||
                                LPAD(honour_award -> 'issued_on' ->> 'month', 2, '0') || '-' ||
                                LPAD(honour_award -> 'issued_on' ->> 'day', 2, '0')
                            )::DATE;
                            issued_on_epoch := EXTRACT(EPOCH FROM issued_on_epoch);
                        EXCEPTION WHEN OTHERS THEN
                            issued_on_epoch := NULL;
                        END;
                    ELSE
                        issued_on_epoch := NULL;
                    END IF;

                    INSERT INTO public.profile_honour_award (
                        title,
                        issuer,
                        issued_on,
                        description,
                        profile_id
                    ) VALUES (
                        honour_award ->> 'title',
                        honour_award ->> 'issuer',
                        issued_on_epoch,
                        honour_award ->> 'description',
                        p_profile_id
                    )
                    ON CONFLICT (profile_id, title, issuer) DO UPDATE SET
                        issued_on = EXCLUDED.issued_on,
                        description = EXCLUDED.description;
                END LOOP;
            END IF;

            -- Upsert into profile_language
            IF profile_record -> 'profile' -> 'languages_and_proficiencies' IS NOT NULL THEN
                FOR language IN
                    SELECT * FROM json_array_elements(profile_record -> 'profile' -> 'languages_and_proficiencies') AS l
                LOOP
                    INSERT INTO public.profile_language (
                        name,
                        proficiency,
                        profile_id
                    ) VALUES (
                        language ->> 'name',
                        language ->> 'proficiency',
                        p_profile_id
                    )
                    ON CONFLICT (profile_id, name) DO UPDATE SET
                        proficiency = EXCLUDED.proficiency;
                END LOOP;
            END IF;

            -- Upsert into profile_organization
            IF profile_record -> 'profile' -> 'accomplishment_organisations' IS NOT NULL THEN
                FOR organization IN
                    SELECT * FROM json_array_elements(profile_record -> 'profile' -> 'accomplishment_organisations') AS o
                LOOP
                    -- Handle starts_at
                    IF organization -> 'starts_at' IS NOT NULL THEN
                        BEGIN
                            org_start_epoch := (
                                (organization -> 'starts_at' ->> 'year') || '-' ||
                                LPAD(organization -> 'starts_at' ->> 'month', 2, '0') || '-' ||
                                LPAD(organization -> 'starts_at' ->> 'day', 2, '0')
                            )::DATE;
                            org_start_epoch := EXTRACT(EPOCH FROM org_start_epoch);
                        EXCEPTION WHEN OTHERS THEN
                            org_start_epoch := NULL;
                        END;
                    ELSE
                        org_start_epoch := NULL;
                    END IF;

                    -- Handle ends_at
                    IF organization -> 'ends_at' IS NOT NULL THEN
                        BEGIN
                            org_end_epoch := (
                                (organization -> 'ends_at' ->> 'year') || '-' ||
                                LPAD(organization -> 'ends_at' ->> 'month', 2, '0') || '-' ||
                                LPAD(organization -> 'ends_at' ->> 'day', 2, '0')
                            )::DATE;
                            org_end_epoch := EXTRACT(EPOCH FROM org_end_epoch);
                        EXCEPTION WHEN OTHERS THEN
                            org_end_epoch := NULL;
                        END;
                    ELSE
                        org_end_epoch := NULL;
                    END IF;

                    INSERT INTO public.profile_organization (
                        starts_at,
                        ends_at,
                        name,
                        title,
                        description,
                        profile_id
                    ) VALUES (
                        org_start_epoch,
                        org_end_epoch,
                        organization ->> 'name',
                        organization ->> 'title',
                        organization ->> 'description',
                        p_profile_id
                    )
                    ON CONFLICT (profile_id, name, title) DO UPDATE SET
                        starts_at = EXCLUDED.starts_at,
                        ends_at = EXCLUDED.ends_at,
                        description = EXCLUDED.description;
                END LOOP;
            END IF;

            -- Upsert into profile_people_also_viewed
            IF profile_record -> 'profile' -> 'people_also_viewed' IS NOT NULL THEN
                FOR people_also_viewed IN
                    SELECT * FROM json_array_elements(profile_record -> 'profile' -> 'people_also_viewed') AS p
                LOOP
                    INSERT INTO public.profile_people_also_viewed (
                        link,
                        name,
                        summary,
                        location,
                        profile_id
                    ) VALUES (
                        people_also_viewed ->> 'link',
                        people_also_viewed ->> 'name',
                        people_also_viewed ->> 'summary',
                        people_also_viewed ->> 'location',
                        p_profile_id
                    )
                    ON CONFLICT (profile_id, link) DO UPDATE SET
                        name = EXCLUDED.name,
                        summary = EXCLUDED.summary,
                        location = EXCLUDED.location;
                END LOOP;
            END IF;

            -- Upsert into profile_project
            IF profile_record -> 'profile' -> 'accomplishment_projects' IS NOT NULL THEN
                FOR project IN
                    SELECT * FROM json_array_elements(profile_record -> 'profile' -> 'accomplishment_projects') AS p
                LOOP
                    -- Handle starts_at
                    IF project -> 'starts_at' IS NOT NULL THEN
                        BEGIN
                            proj_start_epoch := (
                                (project -> 'starts_at' ->> 'year') || '-' ||
                                LPAD(project -> 'starts_at' ->> 'month', 2, '0') || '-' ||
                                LPAD(project -> 'starts_at' ->> 'day', 2, '0')
                            )::DATE;
                            proj_start_epoch := EXTRACT(EPOCH FROM proj_start_epoch);
                        EXCEPTION WHEN OTHERS THEN
                            proj_start_epoch := NULL;
                        END;
                    ELSE
                        proj_start_epoch := NULL;
                    END IF;

                    -- Handle ends_at
                    IF project -> 'ends_at' IS NOT NULL THEN
                        BEGIN
                            proj_end_epoch := (
                                (project -> 'ends_at' ->> 'year') || '-' ||
                                LPAD(project -> 'ends_at' ->> 'month', 2, '0') || '-' ||
                                LPAD(project -> 'ends_at' ->> 'day', 2, '0')
                            )::DATE;
                            proj_end_epoch := EXTRACT(EPOCH FROM proj_end_epoch);
                        EXCEPTION WHEN OTHERS THEN
                            proj_end_epoch := NULL;
                        END;
                    ELSE
                        proj_end_epoch := NULL;
                    END IF;

                    INSERT INTO public.profile_project (
                        title,
                        description,
                        url,
                        starts_at,
                        ends_at,
                        profile_id
                    ) VALUES (
                        project ->> 'title',
                        project ->> 'description',
                        project ->> 'url',
                        proj_start_epoch,
                        proj_end_epoch,
                        p_profile_id
                    )
                    ON CONFLICT (profile_id, title) DO UPDATE SET
                        description = EXCLUDED.description,
                        url = EXCLUDED.url,
                        starts_at = EXCLUDED.starts_at,
                        ends_at = EXCLUDED.ends_at;
                END LOOP;
            END IF;

            -- Upsert into profile_publication
            IF profile_record -> 'profile' -> 'accomplishment_publications' IS NOT NULL THEN
                FOR publication IN
                    SELECT * FROM json_array_elements(profile_record -> 'profile' -> 'accomplishment_publications') AS p
                LOOP
                    IF publication -> 'published_date' IS NOT NULL THEN
                        BEGIN
                            pub_date_epoch := (
                                (publication -> 'published_date' ->> 'year') || '-' ||
                                LPAD(publication -> 'published_date' ->> 'month', 2, '0') || '-' ||
                                LPAD(publication -> 'published_date' ->> 'day', 2, '0')
                            )::DATE;
                            pub_date_epoch := EXTRACT(EPOCH FROM pub_date_epoch);
                        EXCEPTION WHEN OTHERS THEN
                            pub_date_epoch := NULL;
                        END;
                    ELSE
                        pub_date_epoch := NULL;
                    END IF;

                    INSERT INTO public.profile_publication (
                        name,
                        publisher,
                        published_on,
                        description,
                        url,
                        profile_id
                    ) VALUES (
                        publication ->> 'name',
                        publication ->> 'publisher',
                        pub_date_epoch,
                        publication ->> 'description',
                        publication ->> 'url',
                        p_profile_id
                    )
                    ON CONFLICT (profile_id, name, publisher) DO UPDATE SET
                        published_on = EXCLUDED.published_on,
                        description = EXCLUDED.description,
                        url = EXCLUDED.url;
                END LOOP;
            END IF;

            -- Upsert into profile_recommendation
            IF profile_record -> 'profile' -> 'recommendations' IS NOT NULL THEN
                FOR recommendation IN
                    SELECT * FROM json_array_elements_text(profile_record -> 'profile' -> 'recommendations') AS r
                LOOP
                    INSERT INTO public.profile_recommendation (
                        content,
                        profile_id
                    ) VALUES (
                        recommendation,
                        p_profile_id
                    )
                    ON CONFLICT (profile_id, content) DO NOTHING; -- Assuming recommendations are unique by content
                END LOOP;
            END IF;

            -- Upsert into profile_similar_named
            IF profile_record -> 'profile' -> 'similarly_named_profiles' IS NOT NULL THEN
                FOR similar_named IN
                    SELECT * FROM json_array_elements(profile_record -> 'profile' -> 'similarly_named_profiles') AS s
                LOOP
                    INSERT INTO public.profile_similar_named (
                        link,
                        name,
                        summary,
                        location,
                        profile_id
                    ) VALUES (
                        similar_named ->> 'link',
                        similar_named ->> 'name',
                        similar_named ->> 'summary',
                        similar_named ->> 'location',
                        p_profile_id
                    )
                    ON CONFLICT (profile_id, name, location) DO UPDATE SET
                        link = EXCLUDED.link,
                        summary = EXCLUDED.summary,
                        location = EXCLUDED.location; 
                END LOOP;
            END IF;

            -- Upsert into profile_test_score
            IF profile_record -> 'profile' -> 'accomplishment_test_scores' IS NOT NULL THEN
                FOR test_score IN
                    SELECT * FROM json_array_elements(profile_record -> 'profile' -> 'accomplishment_test_scores') AS t
                LOOP
                    -- Handle date_on
                    IF test_score -> 'date_on' IS NOT NULL THEN
                        BEGIN
                            ts_date_epoch := (
                                (test_score -> 'date_on' ->> 'year') || '-' ||
                                LPAD(test_score -> 'date_on' ->> 'month', 2, '0') || '-' ||
                                LPAD(test_score -> 'date_on' ->> 'day', 2, '0')
                            )::DATE;
                            ts_date_epoch := EXTRACT(EPOCH FROM ts_date_epoch);
                        EXCEPTION WHEN OTHERS THEN
                            ts_date_epoch := NULL;
                        END;
                    ELSE
                        ts_date_epoch := NULL;
                    END IF;

                    INSERT INTO public.profile_test_score (
                        name,
                        score,
                        date_on,
                        description,
                        profile_id
                    ) VALUES (
                        test_score ->> 'name',
                        test_score ->> 'score',
                        ts_date_epoch,
                        test_score ->> 'description',
                        p_profile_id
                    )
                    ON CONFLICT (profile_id, name) DO UPDATE SET
                        score = EXCLUDED.score,
                        date_on = EXCLUDED.date_on,
                        description = EXCLUDED.description;
                END LOOP;
            END IF;

            -- Upsert into profile_volunteering_experience
            IF profile_record -> 'profile' -> 'volunteer_work' IS NOT NULL THEN
                FOR volunteering_experience IN
                    SELECT * FROM json_array_elements(profile_record -> 'profile' -> 'volunteer_work') AS v
                LOOP
                    -- Handle starts_at
                    IF volunteering_experience -> 'starts_at' IS NOT NULL THEN
                        BEGIN
                            vol_start_epoch := (
                                (volunteering_experience -> 'starts_at' ->> 'year') || '-' ||
                                LPAD(volunteering_experience -> 'starts_at' ->> 'month', 2, '0') || '-' ||
                                LPAD(volunteering_experience -> 'starts_at' ->> 'day', 2, '0')
                            )::DATE;
                            vol_start_epoch := EXTRACT(EPOCH FROM vol_start_epoch);
                        EXCEPTION WHEN OTHERS THEN
                            vol_start_epoch := NULL;
                        END;
                    ELSE
                        vol_start_epoch := NULL;
                    END IF;

                    -- Handle ends_at
                    IF volunteering_experience -> 'ends_at' IS NOT NULL THEN
                        BEGIN
                            vol_end_epoch := (
                                (volunteering_experience -> 'ends_at' ->> 'year') || '-' ||
                                LPAD(volunteering_experience -> 'ends_at' ->> 'month', 2, '0') || '-' ||
                                LPAD(volunteering_experience -> 'ends_at' ->> 'day', 2, '0')
                            )::DATE;
                            vol_end_epoch := EXTRACT(EPOCH FROM vol_end_epoch);
                        EXCEPTION WHEN OTHERS THEN
                            vol_end_epoch := NULL;
                        END;
                    ELSE
                        vol_end_epoch := NULL;
                    END IF;

                    INSERT INTO public.profile_volunteering_experience (
                        starts_at,
                        ends_at,
                        cause,
                        company,
                        company_profile_url,
                        title,
                        description,
                        logo_url,
                        profile_id
                    ) VALUES (
                        vol_start_epoch,
                        vol_end_epoch,
                        volunteering_experience ->> 'cause',
                        volunteering_experience ->> 'company',
                        volunteering_experience ->> 'company_linkedin_profile_url',
                        volunteering_experience ->> 'title',
                        volunteering_experience ->> 'description',
                        volunteering_experience ->> 'logo_url',
                        p_profile_id
                    )
                    ON CONFLICT (profile_id, company, title) DO UPDATE SET
                        starts_at = EXCLUDED.starts_at,
                        ends_at = EXCLUDED.ends_at,
                        cause = EXCLUDED.cause,
                        company_profile_url = EXCLUDED.company_profile_url,
                        description = EXCLUDED.description,
                        logo_url = EXCLUDED.logo_url;
                END LOOP;
            END IF;
        END;
    END LOOP;
END;
$$;


ALTER FUNCTION public.insert_profiles(profiles json) OWNER TO postgres;

--
-- Name: refresh_company_owner_access(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.refresh_company_owner_access() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    REFRESH MATERIALIZED VIEW company_owner_access;
    RETURN NULL;
END;
$$;


ALTER FUNCTION public.refresh_company_owner_access() OWNER TO postgres;

--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_updated_at_column() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: candidates; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.candidates (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    project_id uuid NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    email text,
    current_position text,
    current_company text,
    experience_years integer,
    location text,
    skills text[],
    education jsonb[],
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    summary text,
    work_history jsonb[] DEFAULT ARRAY[]::jsonb[],
    languages text[] DEFAULT ARRAY[]::text[],
    certifications text[] DEFAULT ARRAY[]::text[],
    image_url text
);


ALTER TABLE public.candidates OWNER TO postgres;

--
-- Name: COLUMN candidates.education; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.candidates.education IS 'Array of education objects with structure: {"institution": string, "degree": string, "field": string, "year": string}';


--
-- Name: COLUMN candidates.work_history; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.candidates.work_history IS 'Array of work history objects with structure: {"company": string, "position": string, "duration": string, "description": string}';


--
-- Name: company_members; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.company_members (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    company_id uuid,
    user_id uuid,
    role public.company_role DEFAULT 'member'::public.company_role NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


ALTER TABLE public.company_members OWNER TO postgres;

--
-- Name: company_profiles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.company_profiles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    industry text,
    size_range integer,
    funding_stage text,
    revenue_growth numeric,
    brand_sentiment integer,
    culture_score integer,
    team_growth numeric,
    headquarters text,
    other_locations text[],
    logo_url text,
    cover_url text,
    website_url text,
    description text,
    specialties text[],
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    employee_count_min integer,
    employee_count_max integer,
    funding_amount integer,
    revenue_growth_percentage integer,
    culture_type character varying(100),
    team_growth_percentage numeric(5,2),
    headquarters_city character varying(100),
    headquarters_country character varying(100),
    cover_image_url text,
    logo_image_url text
);


ALTER TABLE public.company_profiles OWNER TO postgres;

--
-- Name: global_queries; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.global_queries (
    query_hash text NOT NULL,
    parameters jsonb NOT NULL,
    current_version_number integer DEFAULT 1 NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


ALTER TABLE public.global_queries OWNER TO postgres;

--
-- Name: global_query_versions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.global_query_versions (
    query_hash text NOT NULL,
    version_number integer NOT NULL,
    candidate_ids text[] NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


ALTER TABLE public.global_query_versions OWNER TO postgres;

--
-- Name: outreach_status; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.outreach_status (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    project_id uuid NOT NULL,
    candidate_id uuid NOT NULL,
    status text NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT outreach_status_status_check CHECK ((status = ANY (ARRAY['sent'::text, 'opened'::text, 'replied'::text])))
);


ALTER TABLE public.outreach_status OWNER TO postgres;

--
-- Name: profile; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.profile (
    id text NOT NULL,
    profile_pic_url text,
    city text,
    country text,
    first_name text,
    headline text,
    last_name text,
    state text,
    summary text,
    background_cover_image_url text,
    birth_date text,
    connections integer,
    country_full_name text,
    occupation text,
    crawler_name text,
    follower_count integer
);


ALTER TABLE public.profile OWNER TO postgres;

--
-- Name: profile_activity; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.profile_activity (
    title text,
    link text,
    activity_status text,
    profile_id text,
    id integer NOT NULL
);


ALTER TABLE public.profile_activity OWNER TO postgres;

--
-- Name: profile_activity_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.profile_activity ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.profile_activity_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: profile_article; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.profile_article (
    title text,
    link text,
    published_date double precision,
    author text,
    image_url text,
    profile_id text,
    id integer NOT NULL
);


ALTER TABLE public.profile_article OWNER TO postgres;

--
-- Name: profile_article_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.profile_article ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.profile_article_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: profile_certification; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.profile_certification (
    starts_at double precision,
    ends_at double precision,
    url text,
    name text,
    license_number text,
    display_source text,
    authority text,
    profile_id text,
    id integer NOT NULL
);


ALTER TABLE public.profile_certification OWNER TO postgres;

--
-- Name: profile_certification_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.profile_certification ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.profile_certification_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: profile_contacts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.profile_contacts (
    id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    email text
);


ALTER TABLE public.profile_contacts OWNER TO postgres;

--
-- Name: profile_course; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.profile_course (
    name text,
    number text,
    profile_id text,
    id integer NOT NULL
);


ALTER TABLE public.profile_course OWNER TO postgres;

--
-- Name: profile_course_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.profile_course ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.profile_course_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: profile_education; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.profile_education (
    starts_at double precision,
    ends_at double precision,
    field_of_study text,
    degree_name text,
    school text,
    school_profile_url text,
    profile_id text,
    description text,
    logo_url text,
    grade text,
    activities_and_societies text,
    id integer NOT NULL
);


ALTER TABLE public.profile_education OWNER TO postgres;

--
-- Name: profile_education_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.profile_education ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.profile_education_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: profile_experience; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.profile_experience (
    starts_at double precision,
    ends_at double precision,
    company text,
    company_profile_url text,
    title text,
    location text,
    profile_id text,
    description text,
    company_urn text,
    logo_url text,
    normalized_company text,
    id integer NOT NULL
);


ALTER TABLE public.profile_experience OWNER TO postgres;

--
-- Name: profile_experience_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.profile_experience ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.profile_experience_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: profile_group; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.profile_group (
    profile_pic_url text,
    name text,
    url text,
    profile_id text,
    id integer NOT NULL
);


ALTER TABLE public.profile_group OWNER TO postgres;

--
-- Name: profile_group_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.profile_group ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.profile_group_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: profile_honour_award; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.profile_honour_award (
    title text,
    issuer text,
    issued_on double precision,
    description text,
    profile_id text,
    id integer NOT NULL
);


ALTER TABLE public.profile_honour_award OWNER TO postgres;

--
-- Name: profile_honour_award_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.profile_honour_award ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.profile_honour_award_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: profile_language; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.profile_language (
    name text,
    profile_id text,
    proficiency text,
    id integer NOT NULL
);


ALTER TABLE public.profile_language OWNER TO postgres;

--
-- Name: profile_language_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.profile_language ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.profile_language_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: profile_organization; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.profile_organization (
    starts_at double precision,
    ends_at double precision,
    name text,
    title text,
    description text,
    profile_id text,
    id integer NOT NULL
);


ALTER TABLE public.profile_organization OWNER TO postgres;

--
-- Name: profile_organization_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.profile_organization ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.profile_organization_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: profile_patent; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.profile_patent (
    id integer NOT NULL
);


ALTER TABLE public.profile_patent OWNER TO postgres;

--
-- Name: profile_patent_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.profile_patent ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.profile_patent_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: profile_people_also_viewed; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.profile_people_also_viewed (
    link text,
    name text,
    summary text,
    location text,
    profile_id text,
    id integer NOT NULL
);


ALTER TABLE public.profile_people_also_viewed OWNER TO postgres;

--
-- Name: profile_people_also_viewed_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.profile_people_also_viewed ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.profile_people_also_viewed_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: profile_project; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.profile_project (
    title text,
    description text,
    url text,
    profile_id text,
    ends_at double precision,
    starts_at double precision,
    id integer NOT NULL
);


ALTER TABLE public.profile_project OWNER TO postgres;

--
-- Name: profile_project_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.profile_project ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.profile_project_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: profile_publication; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.profile_publication (
    name text,
    publisher text,
    published_on double precision,
    description text,
    url text,
    profile_id text,
    id integer NOT NULL
);


ALTER TABLE public.profile_publication OWNER TO postgres;

--
-- Name: profile_publication_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.profile_publication ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.profile_publication_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: profile_recommendation; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.profile_recommendation (
    content text,
    profile_id text,
    id integer NOT NULL
);


ALTER TABLE public.profile_recommendation OWNER TO postgres;

--
-- Name: profile_recommendation_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.profile_recommendation ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.profile_recommendation_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: profile_similar_named; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.profile_similar_named (
    link text,
    name text,
    summary text,
    location text,
    profile_id text,
    id integer NOT NULL
);


ALTER TABLE public.profile_similar_named OWNER TO postgres;

--
-- Name: profile_similar_named_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.profile_similar_named ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.profile_similar_named_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: profile_test_score; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.profile_test_score (
    name text,
    score text,
    date_on double precision,
    description text,
    profile_id text,
    id integer NOT NULL
);


ALTER TABLE public.profile_test_score OWNER TO postgres;

--
-- Name: profile_test_score_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.profile_test_score ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.profile_test_score_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: profile_volunteering_experience; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.profile_volunteering_experience (
    starts_at double precision,
    ends_at double precision,
    cause text,
    company text,
    company_profile_url text,
    title text,
    profile_id text,
    company_urn text,
    description text,
    logo_url text,
    id integer NOT NULL
);


ALTER TABLE public.profile_volunteering_experience OWNER TO postgres;

--
-- Name: profile_volunteering_experience_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.profile_volunteering_experience ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.profile_volunteering_experience_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: profiles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.profiles (
    id uuid NOT NULL,
    first_name text,
    last_name text,
    avatar_url text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


ALTER TABLE public.profiles OWNER TO postgres;

--
-- Name: project_progress; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.project_progress (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    project_id uuid NOT NULL,
    query_builder integer DEFAULT 0,
    candidate_search integer DEFAULT 0,
    shortlist integer DEFAULT 0,
    culture_fit integer DEFAULT 0,
    comparison integer DEFAULT 0,
    outreach integer DEFAULT 0,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


ALTER TABLE public.project_progress OWNER TO postgres;

--
-- Name: projects; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.projects (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    name text NOT NULL,
    "position" text NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


ALTER TABLE public.projects OWNER TO postgres;

--
-- Name: search_queries; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.search_queries (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    project_id uuid NOT NULL,
    job_titles text[] DEFAULT ARRAY[]::text[],
    skills text[] DEFAULT ARRAY[]::text[],
    languages text[] DEFAULT ARRAY[]::text[],
    nationalities text[] DEFAULT ARRAY[]::text[],
    locations text[] DEFAULT ARRAY[]::text[],
    education_degrees text[] DEFAULT ARRAY[]::text[],
    education_majors text[] DEFAULT ARRAY[]::text[],
    companies text[] DEFAULT ARRAY[]::text[],
    excluded_companies text[] DEFAULT ARRAY[]::text[],
    current_employer text[] DEFAULT ARRAY[]::text[],
    previous_employer text[] DEFAULT ARRAY[]::text[],
    industries text[] DEFAULT ARRAY[]::text[],
    min_experience integer,
    max_experience integer,
    gender text DEFAULT 'both'::text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


ALTER TABLE public.search_queries OWNER TO postgres;

--
-- Name: sent_surveys; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sent_surveys (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    project_id uuid NOT NULL,
    template_id uuid NOT NULL,
    candidate_id text NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    sent_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    completed_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    unique_token uuid,
    email_sent_at timestamp with time zone,
    email_status text,
    survey_status text,
    last_accessed_at timestamp with time zone,
    submission_count integer DEFAULT 0
);


ALTER TABLE public.sent_surveys OWNER TO postgres;

--
-- Name: shortlisted_candidates; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.shortlisted_candidates (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    project_id uuid NOT NULL,
    candidate_id text NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


ALTER TABLE public.shortlisted_candidates OWNER TO postgres;

--
-- Name: survey_responses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.survey_responses (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    project_id uuid NOT NULL,
    candidate_id text NOT NULL,
    responses jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


ALTER TABLE public.survey_responses OWNER TO postgres;

--
-- Name: survey_templates; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.survey_templates (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    project_id uuid NOT NULL,
    name text NOT NULL,
    description text,
    questions jsonb DEFAULT '[]'::jsonb NOT NULL,
    tags text[] DEFAULT ARRAY[]::text[],
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


ALTER TABLE public.survey_templates OWNER TO postgres;

--
-- Name: user_queries_history; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_queries_history (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    project_id uuid NOT NULL,
    query_hash text,
    version_number integer NOT NULL,
    executed_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    number_of_results integer NOT NULL
);


ALTER TABLE public.user_queries_history OWNER TO postgres;

--
-- Name: candidates candidates_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.candidates
    ADD CONSTRAINT candidates_pkey PRIMARY KEY (id);


--
-- Name: company_members company_members_company_id_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.company_members
    ADD CONSTRAINT company_members_company_id_user_id_key UNIQUE (company_id, user_id);


--
-- Name: company_members company_members_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.company_members
    ADD CONSTRAINT company_members_pkey PRIMARY KEY (id);


--
-- Name: company_profiles company_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.company_profiles
    ADD CONSTRAINT company_profiles_pkey PRIMARY KEY (id);


--
-- Name: global_queries global_queries_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.global_queries
    ADD CONSTRAINT global_queries_pkey PRIMARY KEY (query_hash);


--
-- Name: global_query_versions global_query_versions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.global_query_versions
    ADD CONSTRAINT global_query_versions_pkey PRIMARY KEY (query_hash, version_number);


--
-- Name: outreach_status outreach_status_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.outreach_status
    ADD CONSTRAINT outreach_status_pkey PRIMARY KEY (id);


--
-- Name: profile_activity profile_activity_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profile_activity
    ADD CONSTRAINT profile_activity_id_key UNIQUE (id);


--
-- Name: profile_activity profile_activity_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profile_activity
    ADD CONSTRAINT profile_activity_pkey PRIMARY KEY (id);


--
-- Name: profile_activity profile_activity_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profile_activity
    ADD CONSTRAINT profile_activity_unique UNIQUE (profile_id, title);


--
-- Name: profile_article profile_article_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profile_article
    ADD CONSTRAINT profile_article_id_key UNIQUE (id);


--
-- Name: profile_article profile_article_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profile_article
    ADD CONSTRAINT profile_article_pkey PRIMARY KEY (id);


--
-- Name: profile_article profile_article_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profile_article
    ADD CONSTRAINT profile_article_unique UNIQUE (profile_id, link);


--
-- Name: profile_certification profile_certification_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profile_certification
    ADD CONSTRAINT profile_certification_id_key UNIQUE (id);


--
-- Name: profile_certification profile_certification_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profile_certification
    ADD CONSTRAINT profile_certification_pkey PRIMARY KEY (id);


--
-- Name: profile_certification profile_certification_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profile_certification
    ADD CONSTRAINT profile_certification_unique UNIQUE (profile_id, name, license_number);


--
-- Name: profile_contacts profile_contacts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profile_contacts
    ADD CONSTRAINT profile_contacts_pkey PRIMARY KEY (id);


--
-- Name: profile_course profile_course_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profile_course
    ADD CONSTRAINT profile_course_id_key UNIQUE (id);


--
-- Name: profile_course profile_course_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profile_course
    ADD CONSTRAINT profile_course_pkey PRIMARY KEY (id);


--
-- Name: profile_course profile_course_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profile_course
    ADD CONSTRAINT profile_course_unique UNIQUE (profile_id, name);


--
-- Name: profile_education profile_education_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profile_education
    ADD CONSTRAINT profile_education_pkey PRIMARY KEY (id);


--
-- Name: profile_education profile_education_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profile_education
    ADD CONSTRAINT profile_education_unique UNIQUE (profile_id, school, degree_name);


--
-- Name: profile_experience profile_experience_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profile_experience
    ADD CONSTRAINT profile_experience_pkey PRIMARY KEY (id);


--
-- Name: profile_experience profile_experience_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profile_experience
    ADD CONSTRAINT profile_experience_unique UNIQUE (profile_id, company, title);


--
-- Name: profile_group profile_group_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profile_group
    ADD CONSTRAINT profile_group_pkey PRIMARY KEY (id);


--
-- Name: profile_group profile_group_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profile_group
    ADD CONSTRAINT profile_group_unique UNIQUE (profile_id, name);


--
-- Name: profile_honour_award profile_honour_award_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profile_honour_award
    ADD CONSTRAINT profile_honour_award_pkey PRIMARY KEY (id);


--
-- Name: profile_honour_award profile_honour_award_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profile_honour_award
    ADD CONSTRAINT profile_honour_award_unique UNIQUE (profile_id, title, issuer);


--
-- Name: profile_language profile_language_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profile_language
    ADD CONSTRAINT profile_language_pkey PRIMARY KEY (id);


--
-- Name: profile_language profile_language_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profile_language
    ADD CONSTRAINT profile_language_unique UNIQUE (profile_id, name);


--
-- Name: profile_organization profile_organization_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profile_organization
    ADD CONSTRAINT profile_organization_pkey PRIMARY KEY (id);


--
-- Name: profile_organization profile_organization_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profile_organization
    ADD CONSTRAINT profile_organization_unique UNIQUE (profile_id, name, title);


--
-- Name: profile_patent profile_patent_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profile_patent
    ADD CONSTRAINT profile_patent_pkey PRIMARY KEY (id);


--
-- Name: profile_people_also_viewed profile_people_also_viewed_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profile_people_also_viewed
    ADD CONSTRAINT profile_people_also_viewed_pkey PRIMARY KEY (id);


--
-- Name: profile_people_also_viewed profile_people_also_viewed_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profile_people_also_viewed
    ADD CONSTRAINT profile_people_also_viewed_unique UNIQUE (profile_id, link);


--
-- Name: profile profile_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profile
    ADD CONSTRAINT profile_pkey PRIMARY KEY (id);


--
-- Name: profile_project profile_project_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profile_project
    ADD CONSTRAINT profile_project_pkey PRIMARY KEY (id);


--
-- Name: profile_project profile_project_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profile_project
    ADD CONSTRAINT profile_project_unique UNIQUE (profile_id, title);


--
-- Name: profile_publication profile_publication_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profile_publication
    ADD CONSTRAINT profile_publication_pkey PRIMARY KEY (id);


--
-- Name: profile_publication profile_publication_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profile_publication
    ADD CONSTRAINT profile_publication_unique UNIQUE (profile_id, name, publisher);


--
-- Name: profile_recommendation profile_recommendation_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profile_recommendation
    ADD CONSTRAINT profile_recommendation_pkey PRIMARY KEY (id);


--
-- Name: profile_recommendation profile_recommendation_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profile_recommendation
    ADD CONSTRAINT profile_recommendation_unique UNIQUE (profile_id, content);


--
-- Name: profile_similar_named profile_similar_named_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profile_similar_named
    ADD CONSTRAINT profile_similar_named_pkey PRIMARY KEY (id);


--
-- Name: profile_similar_named profile_similar_named_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profile_similar_named
    ADD CONSTRAINT profile_similar_named_unique UNIQUE (profile_id, name, location);


--
-- Name: profile_test_score profile_test_score_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profile_test_score
    ADD CONSTRAINT profile_test_score_pkey PRIMARY KEY (id);


--
-- Name: profile_test_score profile_test_score_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profile_test_score
    ADD CONSTRAINT profile_test_score_unique UNIQUE (profile_id, name);


--
-- Name: profile_volunteering_experience profile_volunteering_experience_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profile_volunteering_experience
    ADD CONSTRAINT profile_volunteering_experience_pkey PRIMARY KEY (id);


--
-- Name: profile_volunteering_experience profile_volunteering_experience_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profile_volunteering_experience
    ADD CONSTRAINT profile_volunteering_experience_unique UNIQUE (profile_id, company, title);


--
-- Name: profiles profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);


--
-- Name: project_progress project_progress_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_progress
    ADD CONSTRAINT project_progress_pkey PRIMARY KEY (id);


--
-- Name: projects projects_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_pkey PRIMARY KEY (id);


--
-- Name: search_queries search_queries_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.search_queries
    ADD CONSTRAINT search_queries_pkey PRIMARY KEY (id);


--
-- Name: search_queries search_queries_project_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.search_queries
    ADD CONSTRAINT search_queries_project_id_key UNIQUE (project_id);


--
-- Name: sent_surveys sent_surveys_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sent_surveys
    ADD CONSTRAINT sent_surveys_pkey PRIMARY KEY (id);


--
-- Name: shortlisted_candidates shortlisted_candidates_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shortlisted_candidates
    ADD CONSTRAINT shortlisted_candidates_pkey PRIMARY KEY (id);


--
-- Name: shortlisted_candidates shortlisted_candidates_project_id_candidate_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shortlisted_candidates
    ADD CONSTRAINT shortlisted_candidates_project_id_candidate_id_key UNIQUE (project_id, candidate_id);


--
-- Name: survey_responses survey_responses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.survey_responses
    ADD CONSTRAINT survey_responses_pkey PRIMARY KEY (id);


--
-- Name: survey_templates survey_templates_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.survey_templates
    ADD CONSTRAINT survey_templates_pkey PRIMARY KEY (id);


--
-- Name: user_queries_history user_queries_history_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_queries_history
    ADD CONSTRAINT user_queries_history_pkey PRIMARY KEY (id);


--
-- Name: idx_global_queries_hash; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_global_queries_hash ON public.global_queries USING btree (query_hash);


--
-- Name: idx_global_query_versions_hash; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_global_query_versions_hash ON public.global_query_versions USING btree (query_hash);


--
-- Name: idx_user_queries_history_project; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_user_queries_history_project ON public.user_queries_history USING btree (project_id);


--
-- Name: idx_user_queries_history_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_user_queries_history_user ON public.user_queries_history USING btree (user_id);


--
-- Name: company_profiles on_company_created; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_company_created AFTER INSERT ON public.company_profiles FOR EACH ROW EXECUTE FUNCTION public.handle_new_company();


--
-- Name: company_members refresh_owner_access; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER refresh_owner_access AFTER INSERT OR DELETE OR UPDATE ON public.company_members FOR EACH STATEMENT EXECUTE FUNCTION public.refresh_company_owner_access();


--
-- Name: company_members update_company_members_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_company_members_updated_at BEFORE UPDATE ON public.company_members FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: company_profiles update_company_profiles_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_company_profiles_updated_at BEFORE UPDATE ON public.company_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: search_queries update_search_queries_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_search_queries_updated_at BEFORE UPDATE ON public.search_queries FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: sent_surveys update_sent_surveys_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_sent_surveys_updated_at BEFORE UPDATE ON public.sent_surveys FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: survey_templates update_survey_templates_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_survey_templates_updated_at BEFORE UPDATE ON public.survey_templates FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: candidates candidates_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.candidates
    ADD CONSTRAINT candidates_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;


--
-- Name: company_members company_members_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.company_members
    ADD CONSTRAINT company_members_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.company_profiles(id) ON DELETE CASCADE;


--
-- Name: company_members company_members_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.company_members
    ADD CONSTRAINT company_members_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: global_query_versions global_query_versions_query_hash_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.global_query_versions
    ADD CONSTRAINT global_query_versions_query_hash_fkey FOREIGN KEY (query_hash) REFERENCES public.global_queries(query_hash);


--
-- Name: outreach_status outreach_status_candidate_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.outreach_status
    ADD CONSTRAINT outreach_status_candidate_id_fkey FOREIGN KEY (candidate_id) REFERENCES public.candidates(id);


--
-- Name: outreach_status outreach_status_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.outreach_status
    ADD CONSTRAINT outreach_status_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id);


--
-- Name: profile_activity profile_activity_profile_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profile_activity
    ADD CONSTRAINT profile_activity_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES public.profile(id) ON DELETE CASCADE;


--
-- Name: profile_article profile_article_profile_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profile_article
    ADD CONSTRAINT profile_article_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES public.profile(id) ON DELETE CASCADE;


--
-- Name: profile_certification profile_certification_profile_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profile_certification
    ADD CONSTRAINT profile_certification_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES public.profile(id) ON DELETE CASCADE;


--
-- Name: profile_contacts profile_contacts_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profile_contacts
    ADD CONSTRAINT profile_contacts_id_fkey FOREIGN KEY (id) REFERENCES public.profile(id);


--
-- Name: profile_honour_award profile_honour_award_profile_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profile_honour_award
    ADD CONSTRAINT profile_honour_award_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES public.profile(id) ON DELETE CASCADE;


--
-- Name: profile_project profile_project_profile_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profile_project
    ADD CONSTRAINT profile_project_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES public.profile(id) ON DELETE CASCADE;


--
-- Name: profile_volunteering_experience profile_volunteering_experience_profile_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profile_volunteering_experience
    ADD CONSTRAINT profile_volunteering_experience_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES public.profile(id) ON DELETE CASCADE;


--
-- Name: profiles profiles_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: project_progress project_progress_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_progress
    ADD CONSTRAINT project_progress_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;


--
-- Name: projects projects_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id);


--
-- Name: search_queries search_queries_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.search_queries
    ADD CONSTRAINT search_queries_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;


--
-- Name: sent_surveys sent_surveys_candidate_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sent_surveys
    ADD CONSTRAINT sent_surveys_candidate_id_fkey FOREIGN KEY (candidate_id) REFERENCES public.profile(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: sent_surveys sent_surveys_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sent_surveys
    ADD CONSTRAINT sent_surveys_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id);


--
-- Name: sent_surveys sent_surveys_template_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sent_surveys
    ADD CONSTRAINT sent_surveys_template_id_fkey FOREIGN KEY (template_id) REFERENCES public.survey_templates(id);


--
-- Name: shortlisted_candidates shortlisted_candidates_candidate_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shortlisted_candidates
    ADD CONSTRAINT shortlisted_candidates_candidate_id_fkey FOREIGN KEY (candidate_id) REFERENCES public.profile(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: shortlisted_candidates shortlisted_candidates_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shortlisted_candidates
    ADD CONSTRAINT shortlisted_candidates_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id);


--
-- Name: survey_responses survey_responses_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.survey_responses
    ADD CONSTRAINT survey_responses_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id);


--
-- Name: survey_templates survey_templates_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.survey_templates
    ADD CONSTRAINT survey_templates_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id);


--
-- Name: user_queries_history user_queries_history_query_hash_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_queries_history
    ADD CONSTRAINT user_queries_history_query_hash_fkey FOREIGN KEY (query_hash) REFERENCES public.global_queries(query_hash);


--
-- Name: user_queries_history user_queries_history_query_hash_version_number_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_queries_history
    ADD CONSTRAINT user_queries_history_query_hash_version_number_fkey FOREIGN KEY (query_hash, version_number) REFERENCES public.global_query_versions(query_hash, version_number);


--
-- Name: sent_surveys Allow public access to sent surveys; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Allow public access to sent surveys" ON public.sent_surveys USING (true) WITH CHECK (true);


--
-- Name: survey_responses Allow public access to survey responses; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Allow public access to survey responses" ON public.survey_responses USING (true) WITH CHECK (true);


--
-- Name: survey_templates Allow public read access to survey templates; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Allow public read access to survey templates" ON public.survey_templates FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.sent_surveys
  WHERE ((sent_surveys.template_id = survey_templates.id) AND (sent_surveys.unique_token IS NOT NULL)))));


--
-- Name: global_queries Enable insert for authenticated users; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable insert for authenticated users" ON public.global_queries FOR INSERT TO authenticated WITH CHECK (true);


--
-- Name: global_query_versions Enable insert for authenticated users; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable insert for authenticated users" ON public.global_query_versions FOR INSERT TO authenticated WITH CHECK (true);


--
-- Name: global_queries Enable read access for authenticated users; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable read access for authenticated users" ON public.global_queries FOR SELECT TO authenticated USING (true);


--
-- Name: global_query_versions Enable read access for authenticated users; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable read access for authenticated users" ON public.global_query_versions FOR SELECT TO authenticated USING (true);


--
-- Name: global_queries Enable update for authenticated users; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable update for authenticated users" ON public.global_queries FOR UPDATE TO authenticated USING (true);


--
-- Name: profiles Public profiles are viewable by everyone.; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);


--
-- Name: projects Users can create their own projects; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can create their own projects" ON public.projects FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: user_queries_history Users can delete their own history; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can delete their own history" ON public.user_queries_history FOR DELETE TO authenticated USING ((auth.uid() = user_id));


--
-- Name: projects Users can delete their own projects; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can delete their own projects" ON public.projects FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: user_queries_history Users can insert their own history; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can insert their own history" ON public.user_queries_history FOR INSERT TO authenticated WITH CHECK ((auth.uid() = user_id));


--
-- Name: profiles Users can insert their own profile.; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK ((auth.uid() = id));


--
-- Name: candidates Users can manage candidates in their projects; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can manage candidates in their projects" ON public.candidates TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.projects
  WHERE ((projects.id = candidates.project_id) AND (projects.user_id = auth.uid())))));


--
-- Name: outreach_status Users can manage outreach status for their projects; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can manage outreach status for their projects" ON public.outreach_status USING ((EXISTS ( SELECT 1
   FROM public.projects
  WHERE ((projects.id = outreach_status.project_id) AND (projects.user_id = auth.uid())))));


--
-- Name: search_queries Users can manage search queries for their projects; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can manage search queries for their projects" ON public.search_queries TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.projects
  WHERE ((projects.id = search_queries.project_id) AND (projects.user_id = auth.uid())))));


--
-- Name: sent_surveys Users can manage sent surveys for their projects; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can manage sent surveys for their projects" ON public.sent_surveys USING ((EXISTS ( SELECT 1
   FROM public.projects
  WHERE ((projects.id = sent_surveys.project_id) AND (projects.user_id = auth.uid())))));


--
-- Name: survey_responses Users can manage survey responses for their projects; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can manage survey responses for their projects" ON public.survey_responses TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.projects
  WHERE ((projects.id = survey_responses.project_id) AND (projects.user_id = auth.uid())))));


--
-- Name: survey_templates Users can manage survey templates for their projects; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can manage survey templates for their projects" ON public.survey_templates USING ((EXISTS ( SELECT 1
   FROM public.projects
  WHERE ((projects.id = survey_templates.project_id) AND (projects.user_id = auth.uid())))));


--
-- Name: shortlisted_candidates Users can manage their shortlisted candidates; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can manage their shortlisted candidates" ON public.shortlisted_candidates USING ((EXISTS ( SELECT 1
   FROM public.projects
  WHERE ((projects.id = shortlisted_candidates.project_id) AND (projects.user_id = auth.uid())))));


--
-- Name: project_progress Users can update progress of their projects; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can update progress of their projects" ON public.project_progress USING ((EXISTS ( SELECT 1
   FROM public.projects
  WHERE ((projects.id = project_progress.project_id) AND (projects.user_id = auth.uid())))));


--
-- Name: profiles Users can update their own profile.; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can update their own profile." ON public.profiles FOR UPDATE USING ((auth.uid() = id));


--
-- Name: projects Users can update their own projects; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can update their own projects" ON public.projects FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: outreach_status Users can view outreach status for their projects; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can view outreach status for their projects" ON public.outreach_status FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.projects
  WHERE ((projects.id = outreach_status.project_id) AND (projects.user_id = auth.uid())))));


--
-- Name: project_progress Users can view progress of their projects; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can view progress of their projects" ON public.project_progress FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.projects
  WHERE ((projects.id = project_progress.project_id) AND (projects.user_id = auth.uid())))));


--
-- Name: sent_surveys Users can view sent surveys for their projects; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can view sent surveys for their projects" ON public.sent_surveys FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.projects
  WHERE ((projects.id = sent_surveys.project_id) AND (projects.user_id = auth.uid())))));


--
-- Name: user_queries_history Users can view their own history; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can view their own history" ON public.user_queries_history FOR SELECT TO authenticated USING ((auth.uid() = user_id));


--
-- Name: projects Users can view their own projects; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can view their own projects" ON public.projects FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: shortlisted_candidates Users can view their shortlisted candidates; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can view their shortlisted candidates" ON public.shortlisted_candidates FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.projects
  WHERE ((projects.id = shortlisted_candidates.project_id) AND (projects.user_id = auth.uid())))));


--
-- Name: candidates; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;

--
-- Name: company_members; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.company_members ENABLE ROW LEVEL SECURITY;

--
-- Name: company_profiles; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.company_profiles ENABLE ROW LEVEL SECURITY;

--
-- Name: global_queries; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.global_queries ENABLE ROW LEVEL SECURITY;

--
-- Name: global_query_versions; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.global_query_versions ENABLE ROW LEVEL SECURITY;

--
-- Name: outreach_status; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.outreach_status ENABLE ROW LEVEL SECURITY;

--
-- Name: profile_contacts; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.profile_contacts ENABLE ROW LEVEL SECURITY;

--
-- Name: profiles; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

--
-- Name: project_progress; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.project_progress ENABLE ROW LEVEL SECURITY;

--
-- Name: projects; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

--
-- Name: company_profiles read_company_profiles; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY read_company_profiles ON public.company_profiles FOR SELECT TO authenticated USING ((id IN ( SELECT company_members.company_id
   FROM public.company_members
  WHERE (company_members.user_id = auth.uid()))));


--
-- Name: company_members read_own_membership; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY read_own_membership ON public.company_members FOR SELECT TO authenticated USING ((auth.uid() = user_id));


--
-- Name: search_queries; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.search_queries ENABLE ROW LEVEL SECURITY;

--
-- Name: sent_surveys; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.sent_surveys ENABLE ROW LEVEL SECURITY;

--
-- Name: shortlisted_candidates; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.shortlisted_candidates ENABLE ROW LEVEL SECURITY;

--
-- Name: survey_responses; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.survey_responses ENABLE ROW LEVEL SECURITY;

--
-- Name: survey_templates; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.survey_templates ENABLE ROW LEVEL SECURITY;

--
-- Name: user_queries_history; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.user_queries_history ENABLE ROW LEVEL SECURITY;

--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT USAGE ON SCHEMA public TO postgres;
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO service_role;


--
-- Name: FUNCTION get_profile_json(p_profile_ids text[]); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.get_profile_json(p_profile_ids text[]) TO anon;
GRANT ALL ON FUNCTION public.get_profile_json(p_profile_ids text[]) TO authenticated;
GRANT ALL ON FUNCTION public.get_profile_json(p_profile_ids text[]) TO service_role;


--
-- Name: FUNCTION handle_new_company(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.handle_new_company() TO anon;
GRANT ALL ON FUNCTION public.handle_new_company() TO authenticated;
GRANT ALL ON FUNCTION public.handle_new_company() TO service_role;


--
-- Name: FUNCTION handle_new_user(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.handle_new_user() TO anon;
GRANT ALL ON FUNCTION public.handle_new_user() TO authenticated;
GRANT ALL ON FUNCTION public.handle_new_user() TO service_role;


--
-- Name: FUNCTION insert_profiles(profiles json); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.insert_profiles(profiles json) TO anon;
GRANT ALL ON FUNCTION public.insert_profiles(profiles json) TO authenticated;
GRANT ALL ON FUNCTION public.insert_profiles(profiles json) TO service_role;


--
-- Name: FUNCTION refresh_company_owner_access(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.refresh_company_owner_access() TO anon;
GRANT ALL ON FUNCTION public.refresh_company_owner_access() TO authenticated;
GRANT ALL ON FUNCTION public.refresh_company_owner_access() TO service_role;


--
-- Name: FUNCTION update_updated_at_column(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.update_updated_at_column() TO anon;
GRANT ALL ON FUNCTION public.update_updated_at_column() TO authenticated;
GRANT ALL ON FUNCTION public.update_updated_at_column() TO service_role;


--
-- Name: TABLE candidates; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.candidates TO anon;
GRANT ALL ON TABLE public.candidates TO authenticated;
GRANT ALL ON TABLE public.candidates TO service_role;


--
-- Name: TABLE company_members; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.company_members TO anon;
GRANT ALL ON TABLE public.company_members TO authenticated;
GRANT ALL ON TABLE public.company_members TO service_role;


--
-- Name: TABLE company_profiles; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.company_profiles TO anon;
GRANT ALL ON TABLE public.company_profiles TO authenticated;
GRANT ALL ON TABLE public.company_profiles TO service_role;


--
-- Name: TABLE global_queries; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.global_queries TO anon;
GRANT ALL ON TABLE public.global_queries TO authenticated;
GRANT ALL ON TABLE public.global_queries TO service_role;


--
-- Name: TABLE global_query_versions; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.global_query_versions TO anon;
GRANT ALL ON TABLE public.global_query_versions TO authenticated;
GRANT ALL ON TABLE public.global_query_versions TO service_role;


--
-- Name: TABLE outreach_status; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.outreach_status TO anon;
GRANT ALL ON TABLE public.outreach_status TO authenticated;
GRANT ALL ON TABLE public.outreach_status TO service_role;


--
-- Name: TABLE profile; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.profile TO anon;
GRANT ALL ON TABLE public.profile TO authenticated;
GRANT ALL ON TABLE public.profile TO service_role;


--
-- Name: TABLE profile_activity; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.profile_activity TO anon;
GRANT ALL ON TABLE public.profile_activity TO authenticated;
GRANT ALL ON TABLE public.profile_activity TO service_role;


--
-- Name: SEQUENCE profile_activity_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.profile_activity_id_seq TO anon;
GRANT ALL ON SEQUENCE public.profile_activity_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.profile_activity_id_seq TO service_role;


--
-- Name: TABLE profile_article; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.profile_article TO anon;
GRANT ALL ON TABLE public.profile_article TO authenticated;
GRANT ALL ON TABLE public.profile_article TO service_role;


--
-- Name: SEQUENCE profile_article_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.profile_article_id_seq TO anon;
GRANT ALL ON SEQUENCE public.profile_article_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.profile_article_id_seq TO service_role;


--
-- Name: TABLE profile_certification; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.profile_certification TO anon;
GRANT ALL ON TABLE public.profile_certification TO authenticated;
GRANT ALL ON TABLE public.profile_certification TO service_role;


--
-- Name: SEQUENCE profile_certification_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.profile_certification_id_seq TO anon;
GRANT ALL ON SEQUENCE public.profile_certification_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.profile_certification_id_seq TO service_role;


--
-- Name: TABLE profile_contacts; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.profile_contacts TO anon;
GRANT ALL ON TABLE public.profile_contacts TO authenticated;
GRANT ALL ON TABLE public.profile_contacts TO service_role;


--
-- Name: TABLE profile_course; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.profile_course TO anon;
GRANT ALL ON TABLE public.profile_course TO authenticated;
GRANT ALL ON TABLE public.profile_course TO service_role;


--
-- Name: SEQUENCE profile_course_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.profile_course_id_seq TO anon;
GRANT ALL ON SEQUENCE public.profile_course_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.profile_course_id_seq TO service_role;


--
-- Name: TABLE profile_education; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.profile_education TO anon;
GRANT ALL ON TABLE public.profile_education TO authenticated;
GRANT ALL ON TABLE public.profile_education TO service_role;


--
-- Name: SEQUENCE profile_education_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.profile_education_id_seq TO anon;
GRANT ALL ON SEQUENCE public.profile_education_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.profile_education_id_seq TO service_role;


--
-- Name: TABLE profile_experience; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.profile_experience TO anon;
GRANT ALL ON TABLE public.profile_experience TO authenticated;
GRANT ALL ON TABLE public.profile_experience TO service_role;


--
-- Name: SEQUENCE profile_experience_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.profile_experience_id_seq TO anon;
GRANT ALL ON SEQUENCE public.profile_experience_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.profile_experience_id_seq TO service_role;


--
-- Name: TABLE profile_group; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.profile_group TO anon;
GRANT ALL ON TABLE public.profile_group TO authenticated;
GRANT ALL ON TABLE public.profile_group TO service_role;


--
-- Name: SEQUENCE profile_group_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.profile_group_id_seq TO anon;
GRANT ALL ON SEQUENCE public.profile_group_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.profile_group_id_seq TO service_role;


--
-- Name: TABLE profile_honour_award; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.profile_honour_award TO anon;
GRANT ALL ON TABLE public.profile_honour_award TO authenticated;
GRANT ALL ON TABLE public.profile_honour_award TO service_role;


--
-- Name: SEQUENCE profile_honour_award_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.profile_honour_award_id_seq TO anon;
GRANT ALL ON SEQUENCE public.profile_honour_award_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.profile_honour_award_id_seq TO service_role;


--
-- Name: TABLE profile_language; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.profile_language TO anon;
GRANT ALL ON TABLE public.profile_language TO authenticated;
GRANT ALL ON TABLE public.profile_language TO service_role;


--
-- Name: SEQUENCE profile_language_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.profile_language_id_seq TO anon;
GRANT ALL ON SEQUENCE public.profile_language_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.profile_language_id_seq TO service_role;


--
-- Name: TABLE profile_organization; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.profile_organization TO anon;
GRANT ALL ON TABLE public.profile_organization TO authenticated;
GRANT ALL ON TABLE public.profile_organization TO service_role;


--
-- Name: SEQUENCE profile_organization_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.profile_organization_id_seq TO anon;
GRANT ALL ON SEQUENCE public.profile_organization_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.profile_organization_id_seq TO service_role;


--
-- Name: TABLE profile_patent; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.profile_patent TO anon;
GRANT ALL ON TABLE public.profile_patent TO authenticated;
GRANT ALL ON TABLE public.profile_patent TO service_role;


--
-- Name: SEQUENCE profile_patent_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.profile_patent_id_seq TO anon;
GRANT ALL ON SEQUENCE public.profile_patent_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.profile_patent_id_seq TO service_role;


--
-- Name: TABLE profile_people_also_viewed; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.profile_people_also_viewed TO anon;
GRANT ALL ON TABLE public.profile_people_also_viewed TO authenticated;
GRANT ALL ON TABLE public.profile_people_also_viewed TO service_role;


--
-- Name: SEQUENCE profile_people_also_viewed_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.profile_people_also_viewed_id_seq TO anon;
GRANT ALL ON SEQUENCE public.profile_people_also_viewed_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.profile_people_also_viewed_id_seq TO service_role;


--
-- Name: TABLE profile_project; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.profile_project TO anon;
GRANT ALL ON TABLE public.profile_project TO authenticated;
GRANT ALL ON TABLE public.profile_project TO service_role;


--
-- Name: SEQUENCE profile_project_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.profile_project_id_seq TO anon;
GRANT ALL ON SEQUENCE public.profile_project_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.profile_project_id_seq TO service_role;


--
-- Name: TABLE profile_publication; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.profile_publication TO anon;
GRANT ALL ON TABLE public.profile_publication TO authenticated;
GRANT ALL ON TABLE public.profile_publication TO service_role;


--
-- Name: SEQUENCE profile_publication_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.profile_publication_id_seq TO anon;
GRANT ALL ON SEQUENCE public.profile_publication_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.profile_publication_id_seq TO service_role;


--
-- Name: TABLE profile_recommendation; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.profile_recommendation TO anon;
GRANT ALL ON TABLE public.profile_recommendation TO authenticated;
GRANT ALL ON TABLE public.profile_recommendation TO service_role;


--
-- Name: SEQUENCE profile_recommendation_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.profile_recommendation_id_seq TO anon;
GRANT ALL ON SEQUENCE public.profile_recommendation_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.profile_recommendation_id_seq TO service_role;


--
-- Name: TABLE profile_similar_named; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.profile_similar_named TO anon;
GRANT ALL ON TABLE public.profile_similar_named TO authenticated;
GRANT ALL ON TABLE public.profile_similar_named TO service_role;


--
-- Name: SEQUENCE profile_similar_named_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.profile_similar_named_id_seq TO anon;
GRANT ALL ON SEQUENCE public.profile_similar_named_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.profile_similar_named_id_seq TO service_role;


--
-- Name: TABLE profile_test_score; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.profile_test_score TO anon;
GRANT ALL ON TABLE public.profile_test_score TO authenticated;
GRANT ALL ON TABLE public.profile_test_score TO service_role;


--
-- Name: SEQUENCE profile_test_score_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.profile_test_score_id_seq TO anon;
GRANT ALL ON SEQUENCE public.profile_test_score_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.profile_test_score_id_seq TO service_role;


--
-- Name: TABLE profile_volunteering_experience; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.profile_volunteering_experience TO anon;
GRANT ALL ON TABLE public.profile_volunteering_experience TO authenticated;
GRANT ALL ON TABLE public.profile_volunteering_experience TO service_role;


--
-- Name: SEQUENCE profile_volunteering_experience_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.profile_volunteering_experience_id_seq TO anon;
GRANT ALL ON SEQUENCE public.profile_volunteering_experience_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.profile_volunteering_experience_id_seq TO service_role;


--
-- Name: TABLE profiles; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.profiles TO anon;
GRANT ALL ON TABLE public.profiles TO authenticated;
GRANT ALL ON TABLE public.profiles TO service_role;


--
-- Name: TABLE project_progress; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.project_progress TO anon;
GRANT ALL ON TABLE public.project_progress TO authenticated;
GRANT ALL ON TABLE public.project_progress TO service_role;


--
-- Name: TABLE projects; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.projects TO anon;
GRANT ALL ON TABLE public.projects TO authenticated;
GRANT ALL ON TABLE public.projects TO service_role;


--
-- Name: TABLE search_queries; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.search_queries TO anon;
GRANT ALL ON TABLE public.search_queries TO authenticated;
GRANT ALL ON TABLE public.search_queries TO service_role;


--
-- Name: TABLE sent_surveys; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.sent_surveys TO anon;
GRANT ALL ON TABLE public.sent_surveys TO authenticated;
GRANT ALL ON TABLE public.sent_surveys TO service_role;


--
-- Name: TABLE shortlisted_candidates; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.shortlisted_candidates TO anon;
GRANT ALL ON TABLE public.shortlisted_candidates TO authenticated;
GRANT ALL ON TABLE public.shortlisted_candidates TO service_role;


--
-- Name: TABLE survey_responses; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.survey_responses TO anon;
GRANT ALL ON TABLE public.survey_responses TO authenticated;
GRANT ALL ON TABLE public.survey_responses TO service_role;


--
-- Name: TABLE survey_templates; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.survey_templates TO anon;
GRANT ALL ON TABLE public.survey_templates TO authenticated;
GRANT ALL ON TABLE public.survey_templates TO service_role;


--
-- Name: TABLE user_queries_history; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.user_queries_history TO anon;
GRANT ALL ON TABLE public.user_queries_history TO authenticated;
GRANT ALL ON TABLE public.user_queries_history TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO service_role;


--
-- PostgreSQL database dump complete
--

