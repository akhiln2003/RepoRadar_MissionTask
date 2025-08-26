import React, { useState, useCallback, useEffect } from "react";
import {
  Search,
  Star,
  GitFork,
  Eye,
  Bookmark,
  BookmarkCheck,
  Trash2,
  ExternalLink,
  Calendar,
  Grid,
  List,
  Github,
  Filter,
  Code,
  TrendingUp,
  Loader2,
} from "lucide-react";
import { SearchInput } from "./components/searchInput";
import { Button } from "./components/Button";
import { StatsCard } from "./components/StatsCard";
import { Alert } from "./components/Alert";
import { Pagination } from "./components/pageNation";
import type { Repository } from "./@types/Repository";
import type { SearchResponse } from "./@types/SearchResponse";

const GitHubExplorer: React.FC = () => {
  const [searchResults, setSearchResults] = useState<Repository[]>([]);
  const [savedRepos, setSavedRepos] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"search" | "saved">("search");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [savingRepoId, setSavingRepoId] = useState<string | number | null>(
    null
  );
  const [currentSearchQuery, setCurrentSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"stars" | "name" | "updated">("stars");
  const [searchPageData, setSearchPageData] = useState({
    pageNum: 1,
    totalPages: 0,
  });
  const [savedPageData, setSavedPageData] = useState({
    pageNum: 1,
    totalPages: 0,
  });
  const [totalCount, setTotalCount] = useState(0);
  const perPage = 10;

  // -------------------- API Functions --------------------
  const searchRepositories = useCallback(
    async (page = 1, select?: string, searchData?: string) => {
      const query = searchData || currentSearchQuery;
      if (!query.trim()) {
        setSearchResults([]);
        setSearchPageData({ pageNum: 1, totalPages: 0 });
        setTotalCount(0);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_SERVER_API
          }search?keyword=${encodeURIComponent(query)}&page=${page}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: SearchResponse = await response.json();

        let repos: Repository[] = [];
        let total = 0;

        if (Array.isArray(data.repos)) {
          repos = data.repos;
          total = data.totalCount || data.total_count || repos.length;
        } else if (data.repos && "repos" in data.repos) {
          repos = data.repos.repos || [];
          total =
            data.repos.totalCount ||
            data.totalCount ||
            data.total_count ||
            repos.length;
        } else if (data.items) {
          repos = data.items;
          total = data.total_count || data.totalCount || repos.length;
        }

        setSearchResults(repos);
        const totalPages = Math.min(Math.ceil(total / perPage), 100);
        setSearchPageData({ pageNum: page, totalPages });
        setTotalCount(total);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An unknown error occurred";
        setError(`Failed to fetch repositories: ${errorMessage}`);
        console.error("Search error:", err);
        setSearchResults([]);
        setSearchPageData({ pageNum: 1, totalPages: 0 });
        setTotalCount(0);
      } finally {
        setLoading(false);
      }
    },
    [currentSearchQuery]
  );

  const fetchSavedRepositories = useCallback(async (page = 1) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_API}fetch-repo?page=${page}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const repos = data.repos?.repos || data.repos || data.items || [];
      const totalPages = data.totalCount || repos.length;

      setSavedRepos(repos);

      setSavedPageData({ pageNum: page, totalPages });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      setError(`Failed to fetch saved repositories: ${errorMessage}`);
      setSavedRepos([]);
      setSavedPageData({ pageNum: 1, totalPages: 0 });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSavedRepositories();
  }, [fetchSavedRepositories]);

  const handleSearch = useCallback(
    (query: string) => {
      setCurrentSearchQuery(query);
      setSearchPageData({ pageNum: 1, totalPages: 0 });

      if (query.trim()) {
        searchRepositories(1, undefined, query);
      } else {
        setSearchResults([]);
        setTotalCount(0);
      }
    },
    [searchRepositories]
  );

  const saveRepository = async (repo: Repository) => {
    const repoId = repo._id || repo.full_name;

    setError("");
    setSuccessMessage("");
    setSavingRepoId(repoId);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_API}saved-repos`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(repo),
        }
      );

      if (!response.ok) {
        let errorMessage = "Failed to save repository";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      await response.json();

      await fetchSavedRepositories();

      setSuccessMessage(
        `Successfully saved "${repo.name}" to your collection!`
      );

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError(`This repository is already saved`);
      console.error("Save error:", err);
    } finally {
      setSavingRepoId(null);
    }
  };

  const removeSavedRepository = async (repoId?: string | number) => {
    console.log("repoId , repoId ", repoId);

    if (!repoId) return;

    setError("");
    setSuccessMessage("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_API}delete-repo/${repoId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        let errorMessage = "Failed to remove repository";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      setSavedRepos((prev) =>
        prev.filter((repo) => (repo._id || repo.full_name) !== repoId)
      );

      await fetchSavedRepositories();

      const repoToRemove = savedRepos.find(
        (repo) => (repo._id || repo.full_name) === repoId
      );
      if (repoToRemove) {
        setSuccessMessage(
          `Removed "${repoToRemove.name}" from your saved repositories`
        );
        setTimeout(() => setSuccessMessage(""), 3000);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
      console.error("Remove error:", err);
    }
  };

  const isRepositorySaved = (repo?: Repository) =>
    !!savedRepos.find((saved) => saved.html_url === repo?.html_url);

  const sortedRepos = (repos: Repository[]) => {
    return [...repos].sort((a, b) => {
      switch (sortBy) {
        case "stars":
          return (b.stargazers_count || 0) - (a.stargazers_count || 0);
        case "name":
          return a.name.localeCompare(b.name);
        case "updated": {
          const aDate = a.updated_at || "";
          const bDate = b.updated_at || "";
          return new Date(bDate).getTime() - new Date(aDate).getTime();
        }
        default:
          return 0;
      }
    });
  };

  useEffect(() => {
    setError("");
    setSuccessMessage("");
  }, [activeTab]);

  // -------------------- Repository Card --------------------
  const RepositoryCard: React.FC<{
    repo: Repository;
    showSaveButton?: boolean;
    showRemoveButton?: boolean;
  }> = ({ repo, showSaveButton = true, showRemoveButton = false }) => {
    const isGrid = viewMode === "grid";
    const repoId = repo._id || repo.full_name;
    const isSaved = isRepositorySaved(repo);
    const isSaving = savingRepoId === repoId;

    return (
      <article
        className={`group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-lg hover:shadow-blue-500/10 hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-300 ${
          isGrid ? "p-6" : "p-4"
        }`}
      >
        <div className={`${isGrid ? "flex flex-col h-full" : "flex gap-6"}`}>
          {/* Header */}
          <div className={`${isGrid ? "mb-4" : "flex-1"}`}>
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Github className="h-5 w-5 text-gray-600 dark:text-gray-400 flex-shrink-0" />
                    <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 truncate">
                      {repo.name}
                    </h3>
                  </div>
                  {repo.language && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full border border-blue-200 dark:border-blue-800">
                      <Code className="h-3 w-3" />
                      {repo.language}
                    </span>
                  )}
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-mono truncate mb-3">
                  {repo.full_name}
                </p>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-2 text-sm leading-relaxed">
              {repo.description || "No description available"}
            </p>

            {/* Stats */}
            <div
              className={`flex gap-2 mb-4 ${
                isGrid ? "flex-wrap" : "flex-wrap lg:flex-nowrap"
              }`}
            >
              <StatsCard
                icon={<Star className="h-4 w-4" />}
                label="Stars"
                value={repo.stargazers_count || 0}
                color="text-yellow-500"
              />
              <StatsCard
                icon={<GitFork className="h-4 w-4" />}
                label="Forks"
                value={repo.forks_count || 0}
                color="text-blue-500"
              />
              <StatsCard
                icon={<Eye className="h-4 w-4" />}
                label="Watchers"
                value={repo.watchers_count || 0}
                color="text-green-500"
              />
            </div>

            {/* Saved Date */}
            {repo.savedAt && (
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-4 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <Calendar className="h-4 w-4 text-green-600" />
                <span>
                  Saved:
                  {new Date(repo.savedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-2 border-t border-gray-100 dark:border-gray-700">
            {showSaveButton && !isSaved && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => saveRepository(repo)}
                disabled={isSaving}
                className="flex-1"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Bookmark className="h-4 w-4" />
                    Save
                  </>
                )}
              </Button>
            )}

            {showSaveButton && isSaved && (
              <Button variant="success" size="sm" disabled className="flex-1">
                <BookmarkCheck className="h-4 w-4" />
                Saved
              </Button>
            )}

            {showRemoveButton && (
              <Button
                variant="danger"
                size="sm"
                onClick={() => removeSavedRepository(repo._id)}
                className="flex-1"
              >
                <Trash2 className="h-4 w-4" />
                Remove
              </Button>
            )}

            <Button
              variant="primary"
              size="sm"
              onClick={() => window.open(repo.html_url, "_blank")}
              className="flex-1"
            >
              <ExternalLink className="h-4 w-4" />
              View
            </Button>
          </div>
        </div>
      </article>
    );
  };

  // -------------------- Render --------------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:space-y-0 lg:space-x-6">
            {/* Brand */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="relative p-3 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl shadow-lg">
                <Github className="h-8 w-8 text-white" />
                <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  GitHub Explorer
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Discover amazing repositories
                </p>
              </div>
            </div>

            {/* Search */}
            <div className="flex-1 max-w-2xl">
              <SearchInput
                placeholder="Search repositories (e.g., react, python, machine learning)..."
                onSearch={handleSearch}
                className="w-full"
              />
            </div>

            {/* Tabs */}
            <nav className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab("search")}
                className={`px-4 py-2 rounded-md font-medium text-sm transition-all duration-200 ${
                  activeTab === "search"
                    ? "bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm"
                    : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  Search
                  {totalCount > 0 && (
                    <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-0.5 rounded-full">
                      {totalCount.toLocaleString()}
                    </span>
                  )}
                </div>
              </button>
              <button
                onClick={() => setActiveTab("saved")}
                className={`px-4 py-2 rounded-md font-medium text-sm transition-all duration-200 ${
                  activeTab === "saved"
                    ? "bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm"
                    : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Bookmark className="h-4 w-4" />
                  Saved
                  {savedRepos.length > 0 && (
                    <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs px-2 py-0.5 rounded-full">
                      {savedRepos.length}
                    </span>
                  )}
                </div>
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Controls */}
      {(searchResults.length > 0 || savedRepos.length > 0) && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                <select
                  value={sortBy}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setSortBy(e.target.value as "stars" | "name" | "updated")
                  }
                  className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="stars">Sort by Stars</option>
                  <option value="name">Sort by Name</option>
                  <option value="updated">Sort by Updated</option>
                </select>
              </div>

              {(activeTab === "search"
                ? searchPageData.totalPages > 0
                : savedPageData.totalPages > 0) && (
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Page
                  {activeTab === "search"
                    ? searchPageData.pageNum
                    : savedPageData.pageNum}
                  of
                  {activeTab === "search"
                    ? searchPageData.totalPages
                    : savedPageData.totalPages}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md transition-all duration-200 ${
                    viewMode === "grid"
                      ? "bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm"
                      : "text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                  }`}
                  aria-label="Grid view"
                >
                  <Grid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md transition-all duration-200 ${
                    viewMode === "list"
                      ? "bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm"
                      : "text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                  }`}
                  aria-label="List view"
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Alert Messages */}
        {error && (
          <Alert type="error" message={error} onClose={() => setError("")} />
        )}

        {successMessage && (
          <Alert
            type="success"
            message={successMessage}
            onClose={() => setSuccessMessage("")}
          />
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="h-12 w-12 text-blue-600 animate-spin mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              {activeTab === "search"
                ? "Searching repositories..."
                : "Loading saved repositories..."}
            </p>
          </div>
        )}

        {/* Search Tab Content */}
        {activeTab === "search" && !loading && (
          <>
            {searchResults.length > 0 ? (
              <div className="space-y-6">
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                      : "space-y-4"
                  }
                >
                  {sortedRepos(searchResults).map((repo, index) => (
                    <RepositoryCard
                      key={repo._id || repo.full_name || index}
                      repo={repo}
                    />
                  ))}
                </div>

                {searchPageData.totalPages > 1 && (
                  <div className="flex justify-center pt-8">
                    <Pagination
                      pageNationData={searchPageData}
                      onPageChange={searchRepositories}
                      setpageNationData={setSearchPageData}
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-16">
                {currentSearchQuery ? (
                  <>
                    <Search className="h-16 w-16 text-gray-400 mx-auto mb-6" />
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      No repositories found
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                      Try searching with different keywords or check your
                      spelling
                    </p>
                  </>
                ) : (
                  <>
                    <div className="mb-6">
                      <div className="relative">
                        <Github className="h-20 w-20 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                        <TrendingUp className="h-8 w-8 text-blue-500 absolute top-0 right-1/2 translate-x-8" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                      Start exploring repositories
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 max-w-lg mx-auto mb-6">
                      Search for repositories using keywords, topics, or
                      programming languages to discover amazing open source
                      projects
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {[
                        "react",
                        "python",
                        "machine learning",
                        "typescript",
                      ].map((suggestion) => (
                        <button
                          key={suggestion}
                          onClick={() => handleSearch(suggestion)}
                          className="px-3 py-1.5 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-full transition-colors duration-200"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </>
        )}

        {/* Saved Tab Content */}
        {activeTab === "saved" && !loading && (
          <div className="space-y-6">
            {savedRepos.length > 0 ? (
              <>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bookmark className="h-5 w-5 text-green-600" />
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        Your Saved Repositories
                      </h2>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {savedPageData.totalPages * perPage > 0
                        ? savedPageData.totalPages * perPage
                        : savedRepos.length}
                      {savedRepos.length === 1 ? "repository" : "repositories"}
                    </span>
                  </div>
                </div>

                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                      : "space-y-4"
                  }
                >
                  {sortedRepos(savedRepos).map((repo, index) => (
                    <RepositoryCard
                      key={repo._id || repo.full_name || index}
                      repo={repo}
                      showSaveButton={false}
                      showRemoveButton={true}
                    />
                  ))}
                </div>

                {savedPageData.totalPages > 1 && (
                  <div className="flex justify-center pt-8">
                    <Pagination
                      pageNationData={savedPageData}
                      onPageChange={fetchSavedRepositories} // <-- fetch page from backend
                      setpageNationData={setSavedPageData}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16">
                <div className="mb-6">
                  <div className="relative">
                    <Bookmark className="h-20 w-20 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <div className="absolute -top-2 -right-2 h-8 w-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <BookmarkCheck className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                  No saved repositories yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-8">
                  Start saving repositories you find interesting while browsing.
                  They'll appear here for quick access later.
                </p>
                <Button
                  onClick={() => setActiveTab("search")}
                  size="lg"
                  className="gap-2"
                >
                  <Search className="h-5 w-5" />
                  Browse Repositories
                </Button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default GitHubExplorer;
