import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getStories } from "../../service/story.service";
import {
  Clock,
  BookOpen,
  Eye,
  Tag,
  Search,
  Filter,
  TrendingUp,
  ChevronRight,
  Star,
  BarChart3,
  Users
} from "lucide-react";

type Story = {
  id: string;
  title: string;
  japaneseTitle: string;
  description: string;
  level: string;
  difficulty: string;
  duration: string;
  wordCount: number;
  readCount: number;
  tags: string[];
  rating?: number;
  author?: string;
  imageUrl?: string;
};

type SortOption = "newest" | "popular" | "difficulty" | "wordCount";

const StoriesPage: React.FC = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [filteredStories, setFilteredStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [showFilters, setShowFilters] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const res = await getStories();
        // Add some mock data for demonstration
        const enhancedStories = res.data.map((story: Story, index: number) => ({
          ...story,
          rating: Math.floor(Math.random() * 2) + 4, // 4-5 stars
          author: ["Yuki Tanaka", "Haruto Sato", "Sakura Yamamoto", "Kenji Ito"][index % 4],
          imageUrl: `https://picsum.photos/seed/${story.id}/400/300`
        }));
        setStories(enhancedStories);
        setFilteredStories(enhancedStories);
      } catch (error) {
        console.error("Error fetching stories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    let result = [...stories];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        story =>
          story.title.toLowerCase().includes(query) ||
          story.japaneseTitle.toLowerCase().includes(query) ||
          story.description.toLowerCase().includes(query) ||
          story.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Level filter
    if (selectedLevel !== "all") {
      result = result.filter(story => story.level === selectedLevel);
    }

    // Difficulty filter
    if (selectedDifficulty !== "all") {
      result = result.filter(story => story.difficulty === selectedDifficulty);
    }

    // Sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case "popular":
          return b.readCount - a.readCount;
        case "difficulty":
          const difficultyOrder = { "Beginner": 1, "Intermediate": 2, "Advanced": 3 };
          return (difficultyOrder[a.difficulty as keyof typeof difficultyOrder] || 0) - 
                 (difficultyOrder[b.difficulty as keyof typeof difficultyOrder] || 0);
        case "wordCount":
          return a.wordCount - b.wordCount;
        default:
          return 0; // newest - maintain original order
      }
    });

    setFilteredStories(result);
  }, [stories, searchQuery, selectedLevel, selectedDifficulty, sortBy]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-800 border-green-200";
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Advanced":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "N5":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "N4":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "N3":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "N2":
        return "bg-pink-100 text-pink-800 border-pink-200";
      case "N1":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={14}
            className={`${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
          />
        ))}
        <span className="text-sm text-gray-600 ml-1">{rating.toFixed(1)}</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading stories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">📚 Japanese Stories</h1>
            <p className="text-xl md:text-2xl mb-6 opacity-90">
              Immerse yourself in authentic Japanese reading practice
            </p>
            <p className="max-w-2xl mx-auto text-lg opacity-80">
              Read captivating stories at your JLPT level. Improve your Japanese comprehension while enjoying engaging narratives.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="bg-white rounded-xl shadow-lg p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookOpen className="text-blue-600" size={24} />
              </div>
              <div className="text-left">
                <p className="text-2xl font-bold text-gray-900">{stories.length}</p>
                <p className="text-sm text-gray-600">Total Stories</p>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="text-green-600" size={24} />
              </div>
              <div className="text-left">
                <p className="text-2xl font-bold text-gray-900">
                  {stories.reduce((sum, story) => sum + story.readCount, 0).toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">Total Reads</p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <BarChart3 className="text-purple-600" size={24} />
              </div>
              <div className="text-left">
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(stories.reduce((sum, story) => sum + story.wordCount, 0) / stories.length)}
                </p>
                <p className="text-sm text-gray-600">Avg. Words</p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <TrendingUp className="text-yellow-600" size={24} />
              </div>
              <div className="text-left">
                <p className="text-2xl font-bold text-gray-900">
                  {stories.filter(s => s.difficulty === "Beginner").length}
                </p>
                <p className="text-sm text-gray-600">Beginner Stories</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Bar */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search stories by title, content, or tags..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all shadow-sm"
              />
            </div>

            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-6 py-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              <Filter size={20} />
              Filters
            </button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Level Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    JLPT Level
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {["all", "N5", "N4", "N3", "N2", "N1"].map((level) => (
                      <button
                        key={level}
                        onClick={() => setSelectedLevel(level)}
                        className={`px-4 py-2 rounded-lg transition-all ${
                          selectedLevel === level
                            ? "bg-indigo-100 text-indigo-700 border border-indigo-300"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {level === "all" ? "All Levels" : level}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Difficulty Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Difficulty
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {["all", "Beginner", "Intermediate", "Advanced"].map((difficulty) => (
                      <button
                        key={difficulty}
                        onClick={() => setSelectedDifficulty(difficulty)}
                        className={`px-4 py-2 rounded-lg transition-all ${
                          selectedDifficulty === difficulty
                            ? "bg-indigo-100 text-indigo-700 border border-indigo-300"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {difficulty === "all" ? "All" : difficulty}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sort Options */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort By
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as SortOption)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    >
                      <option value="newest">Newest First</option>
                      <option value="popular">Most Popular</option>
                      <option value="difficulty">Difficulty</option>
                      <option value="wordCount">Word Count</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Results Count */}
          <div className="flex justify-between items-center mb-4">
            <p className="text-gray-600">
              Showing <span className="font-semibold">{filteredStories.length}</span> of{" "}
              <span className="font-semibold">{stories.length}</span> stories
            </p>
            <div className="flex gap-2">
              {(selectedLevel !== "all" || selectedDifficulty !== "all" || searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedLevel("all");
                    setSelectedDifficulty("all");
                    setSearchQuery("");
                    setSortBy("newest");
                  }}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Stories Grid */}
        {filteredStories.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStories.map((story) => (
              <div
                key={story.id}
                onClick={() => navigate(`/stories/${story.id}`)}
                className="group cursor-pointer bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Story Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={story.imageUrl}
                    alt={story.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getLevelColor(story.level)}`}>
                      {story.level}
                    </span>
                  </div>
                </div>

                {/* Story Content */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                        {story.title}
                      </h2>
                      <p className="text-gray-600 text-sm mt-1 font-japanese">
                        {story.japaneseTitle}
                      </p>
                    </div>
                    {story.rating && renderStars(story.rating)}
                  </div>

                  <p className="text-gray-700 mb-4 line-clamp-2">
                    {story.description}
                  </p>

                  {/* Author */}
                  {story.author && (
                    <p className="text-sm text-gray-500 mb-3">
                      By <span className="font-medium">{story.author}</span>
                    </p>
                  )}

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {story.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full flex items-center gap-1"
                      >
                        <Tag size={12} />
                        {tag}
                      </span>
                    ))}
                    {story.tags.length > 3 && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        +{story.tags.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock size={16} />
                        <span>{story.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen size={16} />
                        <span>{story.wordCount.toLocaleString()} words</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                      <Eye size={16} />
                      <span>{story.readCount.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Difficulty Badge */}
                  <div className="mt-4 flex justify-between items-center">
                    <span className={`px-3 py-1 rounded-lg text-sm font-medium border ${getDifficultyColor(story.difficulty)}`}>
                      {story.difficulty}
                    </span>
                    <button className="flex items-center gap-1 text-indigo-600 hover:text-indigo-700 font-medium">
                      Read Story
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Search size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">No stories found</h3>
            <p className="text-gray-500 mb-6">
              Try adjusting your search or filters to find what you're looking for.
            </p>
            <button
              onClick={() => {
                setSelectedLevel("all");
                setSelectedDifficulty("all");
                setSearchQuery("");
              }}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              View All Stories
            </button>
          </div>
        )}

        {/* Featured Collections */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Collections</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl p-6 text-white">
              <h3 className="text-xl font-bold mb-2">Beginner's Journey</h3>
              <p className="opacity-90 mb-4">Start with simple stories for N5-N4 learners</p>
              <div className="text-sm opacity-80">
                {stories.filter(s => s.level === "N5" || s.level === "N4").length} stories
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 text-white">
              <h3 className="text-xl font-bold mb-2">Intermediate Challenges</h3>
              <p className="opacity-90 mb-4">Build confidence with N3-N2 level content</p>
              <div className="text-sm opacity-80">
                {stories.filter(s => s.level === "N3" || s.level === "N2").length} stories
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 text-white">
              <h3 className="text-xl font-bold mb-2">Advanced Mastery</h3>
              <p className="opacity-90 mb-4">Challenge yourself with N1 level material</p>
              <div className="text-sm opacity-80">
                {stories.filter(s => s.level === "N1").length} stories
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS */}
      <style>{`
        .line-clamp-1 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
        }
        .line-clamp-2 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }
        .font-japanese {
          font-family: 'Hiragino Kaku Gothic Pro', 'Meiryo', sans-serif;
        }
        .group:hover .group-hover\\:scale-105 {
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );
};

export default StoriesPage;