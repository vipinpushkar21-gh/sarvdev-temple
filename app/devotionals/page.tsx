"use client"

import { useEffect, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Hero from '../../components/Hero'

import { CategoryTabs } from './components/CategoryTabs';
import { FULL_CATEGORIES } from './components/categories';
import { SearchBar } from './components/SearchBar';
import { DevotionalCard } from './components/DevotionalCard';
import { TextToSpeech } from './components/TextToSpeech';
import { renderBilingualTitle, isDevanagari } from './utils/bilingual';

// Helper function to create URL slug from title
function createSlug(title: string): string {
  // Extract English text from parentheses if present (e.g., "श्री गणेश आरती (Shri Ganesh Aarti)")
  const englishMatch = title.match(/\(([^)]+)\)/);
  let text = englishMatch ? englishMatch[1] : title;
  
  // Create slug from text
  let slug = text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
  
  // If slug is empty (all Devanagari text), transliterate basic characters or use a generic fallback
  if (!slug || slug === '-' || slug === '') {
    // Simple transliteration map for common words
    const translitMap: {[key: string]: string} = {
      'श्री': 'shri',
      'गणेश': 'ganesh',
      'आरती': 'aarti',
      'चालीसा': 'chalisa',
      'मंत्र': 'mantra',
      'स्तोत्र': 'stotra',
      'भजन': 'bhajan'
    };
    
    // Try to transliterate known words
    let transliterated = title.toLowerCase();
    for (const [devanagari, english] of Object.entries(translitMap)) {
      transliterated = transliterated.replace(new RegExp(devanagari, 'g'), english);
    }
    
    slug = transliterated
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
  
  return slug || 'devotional';
}

type Devotional = {
  _id: string
  title: string
  description?: string
  category?: string
  language?: string
  deity?: string
  audio?: string
  lyrics?: string
  duration?: string
  artist?: string
  status?: string
  type?: string
  names?: { sanskrit?: string; mantra?: string; english?: string }[]
}

// Build a full categories list from config, and include any dynamic categories present in data

export default function DevotionalsPage() {
  const [devotionals, setDevotionals] = useState<Devotional[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [showTransliteration, setShowTransliteration] = useState(true);
  const [groupByLanguage, setGroupByLanguage] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [languageFilter, setLanguageFilter] = useState("all");
  const [deityFilter, setDeityFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState<'az' | 'za'>('az');
  const [visibleCount, setVisibleCount] = useState(12);

  useEffect(() => {
    async function fetchDevotionals() {
      try {
        const res = await fetch(`/api/devotionals`);
        if (res.ok) {
          const data = await res.json();
          const approved = data.filter((d: Devotional) => d.status === "approved");
          setDevotionals(approved);
        }
      } catch (error) {
        console.error("Failed to fetch devotionals:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchDevotionals();
  }, []);

  // Debounce search to reduce re-renders
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 200);
    return () => clearTimeout(t);
  }, [search]);

  const languages = useMemo(() => {
    const setVals = new Set<string>();
    devotionals.forEach(d => { if (d.language) setVals.add(d.language); });
    return ['all', ...Array.from(setVals).sort()];
  }, [devotionals]);

  const deities = useMemo(() => {
    const setVals = new Set<string>();
    devotionals.forEach(d => { if (d.deity) setVals.add(d.deity); });
    return ['all', ...Array.from(setVals).sort()];
  }, [devotionals]);

    // Build full categories from config, augment with any categories seen in data, and attach counts
    const categoriesWithCounts = useMemo(() => {
      const seen = new Set<string>();
      devotionals.forEach(d => { if (d.category) seen.add(d.category); });

      // Start with configured categories
      const base = [...FULL_CATEGORIES];

      // Add any missing categories discovered in data
      for (const id of Array.from(seen)) {
        if (!base.find(c => c.id === id)) {
          base.push({ id, label: id, hindi: id, icon: '📄' });
        }
      }

      const result = [
        { id: 'all', label: 'All', hindi: 'सभी', icon: '🕉️', count: devotionals.length },
        ...base.map(cat => {
          const count = devotionals.filter(d => d.category === cat.id).length;
          return { id: cat.id, label: cat.label, hindi: cat.hindi, icon: cat.icon, count };
        })
      ];

      // Display all categories including zero counts (except when dataset empty we still show All)
      return result;
    }, [devotionals]);

    // Filter devotionals by category, language, deity and search
    const filteredDevotionals = useMemo(() =>
      devotionals.filter((d) => {
        const matchesCategory = activeCategory === "all" || d.category === activeCategory;
        const matchesLanguage = languageFilter === 'all' || (d.language === languageFilter);
        const matchesDeity = deityFilter === 'all' || (d.deity === deityFilter);
        const term = debouncedSearch.trim().toLowerCase();
        const matchesSearch = !term ||
          d.title?.toLowerCase().includes(term) ||
          d.description?.toLowerCase().includes(term) ||
          d.deity?.toLowerCase().includes(term) ||
          d.artist?.toLowerCase().includes(term);
        return matchesCategory && matchesLanguage && matchesDeity && matchesSearch;
      }),
      [devotionals, activeCategory, languageFilter, deityFilter, debouncedSearch]
    );

    const sortedDevotionals = useMemo(() => {
      const arr = [...filteredDevotionals];
      arr.sort((a, b) => {
        const ta = (a.title || '').toLowerCase();
        const tb = (b.title || '').toLowerCase();
        return sortOrder === 'az' ? ta.localeCompare(tb) : tb.localeCompare(ta);
      });
      return arr;
    }, [filteredDevotionals, sortOrder]);

    const limitedSorted = useMemo(() => sortedDevotionals.slice(0, visibleCount), [sortedDevotionals, visibleCount]);

    function normalizeLanguage(lang?: string): 'Hindi' | 'English' | 'Sanskrit' | 'Other' {
      const l = (lang || '').toLowerCase();
      if (l.includes('hi')) return 'Hindi';
      if (l.includes('en')) return 'English';
      if (l.includes('sa') || l.includes('sanskrit') || l.includes('संस्क')) return 'Sanskrit';
      return 'Other';
    }

    const languageOrder: Array<'Hindi' | 'English' | 'Sanskrit' | 'Other'> = ['Hindi', 'English', 'Sanskrit', 'Other'];

    const groupedLimited = useMemo(() => {
      const map: Record<string, Devotional[]> = { Hindi: [], English: [], Sanskrit: [], Other: [] };
      for (const d of limitedSorted) {
        map[normalizeLanguage(d.language)].push(d);
      }
      return map;
    }, [limitedSorted]);

    if (loading) {
      return (
        <>
          <Hero title="Devotionals" subtitle="Explore sacred mantras, bhajans, stotras and more" />
          <main className="max-w-6xl mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-5">
                  <div className="animate-pulse space-y-4">
                    <div className="h-6 bg-neutral-200 dark:bg-neutral-800 rounded w-3/4" />
                    <div className="flex gap-2">
                      <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-20" />
                      <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-16" />
                      <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-24" />
                    </div>
                    <div className="h-20 bg-neutral-200 dark:bg-neutral-800 rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          </main>
        </>
      );
    }

    return (
      <>
        <Hero title="Devotionals" subtitle="Explore sacred mantras, bhajans, stotras and more" />
        <main className="max-w-6xl mx-auto px-4 py-12 min-h-screen bg-background">
          <div className="relative z-10">
            {/* Slim CTA below Hero */}
            <div className="mb-10 max-w-3xl mx-auto">
              <div className="rounded-lg bg-background border border-accent text-text px-4 py-3 flex items-center justify-between">
                <span className="font-medium">Browse devotionals by category, language, or deity.</span>
                <a href="#categories" className="btn btn-primary rounded-full">Browse Categories</a>
              </div>
            </div>

          {/* Featured Devotionals */}
          <section aria-labelledby="featured" className="mb-12">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="text-3xl text-accent" aria-hidden>✨</div>
              <h2 id="featured" className="text-2xl font-bold text-primary tracking-tight">Featured Devotionals</h2>
              <div className="text-3xl text-accent" aria-hidden>✨</div>
            </div>
            <FeaturedGrid devotionals={devotionals} />
          </section>

          {/* Search and Category Tabs */}
          <section className="mb-12" id="categories">
            <h2 className="text-2xl font-bold text-primary mb-7 text-center tracking-tight">Browse by Category</h2>
            <div className="sticky top-0 z-20 bg-background/90 backdrop-blur py-3 mb-6">
              <div className="flex flex-col md:flex-row md:flex-wrap md:items-center md:justify-between gap-4">
                <div className="flex-1 min-w-[280px]">
                  <CategoryTabs
                    categories={categoriesWithCounts}
                    activeCategory={activeCategory}
                    onSelect={setActiveCategory}
                  />
                </div>
                <div className="w-full md:w-80">
                  <SearchBar value={search} onChange={setSearch} placeholder="Search devotionals..." />
                </div>
                <div className="w-full md:w-auto flex gap-2 items-center">
                  <select aria-label="Filter by language" value={languageFilter} onChange={e => setLanguageFilter(e.target.value)}
                    className="flex-1 md:flex-none px-3 py-2 rounded-lg border bg-background text-text focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400">
                    {languages.map(l => (<option key={l} value={l}>{l === 'all' ? 'All languages' : l}</option>))}
                  </select>
                  <select aria-label="Filter by deity" value={deityFilter} onChange={e => setDeityFilter(e.target.value)}
                    className="flex-1 md:flex-none px-3 py-2 rounded-lg border bg-background text-text focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400">
                    {deities.map(d => (<option key={d} value={d}>{d === 'all' ? 'All deities' : d}</option>))}
                  </select>
                  <select aria-label="Sort" value={sortOrder} onChange={e => setSortOrder(e.target.value as 'az' | 'za')}
                    className="px-3 py-2 rounded-lg border bg-background text-text focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400">
                    <option value="az">A–Z</option>
                    <option value="za">Z–A</option>
                  </select>
                  <label className="flex items-center gap-2 ml-2 text-sm text-text">
                    <input
                      type="checkbox"
                      className="accent-primary-500 h-4 w-4"
                      checked={showTransliteration}
                      onChange={(e) => setShowTransliteration(e.target.checked)}
                    />
                    Show English transliteration
                  </label>
                  <label className="flex items-center gap-2 ml-2 text-sm text-text">
                    <input
                      type="checkbox"
                      className="accent-primary-500 h-4 w-4"
                      checked={groupByLanguage}
                      onChange={(e) => setGroupByLanguage(e.target.checked)}
                    />
                    Group by language
                  </label>
                </div>
              </div>
            </div>
          </section>

          {/* Recent Devotionals */}
          <section>
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="text-3xl text-accent" aria-hidden>🌟</div>
              <h2 className="text-3xl font-bold text-primary tracking-tight">Recently Added</h2>
              <div className="text-3xl text-accent" aria-hidden>🌟</div>
            </div>
            {filteredDevotionals.length === 0 ? (
              <div className="text-center py-12 text-text text-lg font-bold">
                No devotionals found.
              </div>
            ) : (
              <>
                {groupByLanguage ? (
                  <div>
                    {languageOrder.map((lang) => {
                      const group = groupedLimited[lang] || [];
                      if (!group.length) return null;
                      return (
                        <div key={lang} className="mb-10">
                          <div className="flex items-center gap-3 mb-4">
                            <h3 className="text-2xl font-bold text-[#a9441a] dark:text-[#ffd700] tracking-tight font-playfair">{lang}</h3>
                            <span className="text-sm text-[#7c3a0a] dark:text-[#ffe5b4]">({group.length})</span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {group.map((d) => (
                              <Link key={d._id} href={`/devotionals/${createSlug(d.title || '')}`}
                                className="focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
                              >
                                <DevotionalCard
                                  title={d.title || ''}
                                  titleNode={(function(){
                                    const bt = renderBilingualTitle(d.title || '');
                                    const primary = highlightText(bt.primary, debouncedSearch);
                                    const secondary = (showTransliteration && bt.secondary) ? highlightText(bt.secondary, debouncedSearch) : null;
                                    return (
                                      <div>
                                        <div>{primary}</div>
                                        {secondary && <div className="text-sm text-neutral-600 dark:text-neutral-300 mt-0.5">{secondary}</div>}
                                      </div>
                                    );
                                  })()}
                                  category={d.category}
                                  language={d.language}
                                  type={d.type}
                                  description={d.description}
                                  descriptionNode={d.description ? highlightText(d.description, debouncedSearch) : undefined}
                                />
                              </Link>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence>
                      {sortedDevotionals.slice(0, visibleCount).map((d) => (
                        <Link key={d._id} href={`/devotionals/${createSlug(d.title || '')}`}
                                  className="focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
                        >
                          <DevotionalCard
                            title={d.title || ''}
                            titleNode={(function(){
                              const bt = renderBilingualTitle(d.title || '');
                              const primary = highlightText(bt.primary, debouncedSearch);
                              const secondary = (showTransliteration && bt.secondary) ? highlightText(bt.secondary, debouncedSearch) : null;
                              return (
                                <div>
                                  <div>{primary}</div>
                                  {secondary && <div className="text-sm text-text mt-0.5">{secondary}</div>}
                                </div>
                              );
                            })()}
                            category={d.category}
                            language={d.language}
                            type={d.type}
                            description={d.description}
                            descriptionNode={d.description ? highlightText(d.description, debouncedSearch) : undefined}
                          />
                        </Link>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
                {sortedDevotionals.length > visibleCount && (
                  <div className="mt-8 flex justify-center">
                    <button type="button" onClick={() => setVisibleCount(c => c + 12)} className="btn btn-primary rounded-full">Load More</button>
                  </div>
                )}
              </>
            )}
          </section>
          </div>
        </main>
      </>
    );
  }

  // Featured grid component inline
  function FeaturedGrid({ devotionals }: { devotionals: Devotional[] }) {
    const featured = useMemo(() => {
      const priority = new Set(['Mantra', 'Chalisa', 'Aarti', '108 Namavali']);
      const arr = devotionals.filter(d => (d.category ? priority.has(d.category) : false));
      return arr.slice(0, 6);
    }, [devotionals]);

    if (featured.length === 0) {
      return (
        <div className="text-center py-6 text-text">No featured devotionals yet.</div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featured.map((d) => (
          <Link key={d._id} href={`/devotionals/${createSlug(d.title || '')}`}
            className="focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
          >
            <DevotionalCard
              title={d.title || ''}
              category={d.category}
              language={d.language}
              type={d.type}
              description={d.description}
            />
          </Link>
        ))}
      </div>
    );
  }

  // Helper: highlight matched search terms
  function highlightText(text: string, term: string) {
    const t = term.trim();
    if (!t) return text;
    const escaped = t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escaped})`, 'gi');
    const parts = text.split(regex);
    return parts.map((p, i) => (
      p.toLowerCase() === t.toLowerCase()
        ? <mark key={i} className="bg-accent text-text rounded px-1">{p}</mark>
        : p
    ));
  }
