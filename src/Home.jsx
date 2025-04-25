import { useState } from 'react';

export default function Home() {
  const [searchParams, setSearchParams] = useState({
    artist: '',
    title: ''
  });
  const [lyrics, setLyrics] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentSong, setCurrentSong] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const searchLyrics = async (e) => {
    e.preventDefault();
    
    if (!searchParams.artist || !searchParams.title) {
      setError('Please enter both artist and song title');
      return;
    }

    setLoading(true);
    setError('');
    setLyrics('');

    try {
      const response = await fetch(`https://api.lyrics.ovh/v1/${encodeURIComponent(searchParams.artist)}/${encodeURIComponent(searchParams.title)}`);
      
      if (!response.ok) {
        throw new Error(response.status === 404 
          ? 'No lyrics found. Please check spelling or try another song.' 
          : 'Failed to fetch lyrics. Please try again later.');
      }
      
      const data = await response.json();
      
      setLyrics(data.lyrics);
      setCurrentSong({
        title: searchParams.title,
        artist: searchParams.artist
      });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-blue-800 text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Museekly</h1>
          <p className="text-lg text-purple-200">Find lyrics to your favorite songs</p>
        </header>

        <form onSubmit={searchLyrics} className="bg-white/10 backdrop-blur-md rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="artist" className="block mb-2 font-medium">Artist</label>
              <input
                type="text"
                id="artist"
                name="artist"
                value={searchParams.artist}
                onChange={handleInputChange}
                placeholder="Enter artist name"
                className="w-full px-4 py-2 bg-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 text-white placeholder:text-gray-300"
              />
            </div>
            <div>
              <label htmlFor="title" className="block mb-2 font-medium">Song Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={searchParams.title}
                onChange={handleInputChange}
                placeholder="Enter song title"
                className="w-full px-4 py-2 bg-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 text-white placeholder:text-gray-300"
              />
            </div>
          </div>
          <button 
            type="submit" 
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-md transition duration-300 flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Searching...
              </>
            ) : 'Search Lyrics'}
          </button>
        </form>

        {error && (
          <div className="bg-red-500/70 backdrop-blur-md rounded-lg p-4 mb-8 text-white">
            <p>{error}</p>
          </div>
        )}

        {currentSong && lyrics && (
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 mb-8">
            <div className="mb-4 pb-4 border-b border-white/20">
              <h2 className="text-2xl font-bold">{currentSong.title}</h2>
              <p className="text-xl text-purple-300">by {currentSong.artist}</p>
            </div>
            <div className="max-h-96 overflow-y-auto lyrics-content">
              <pre className="whitespace-pre-wrap font-sans text-lg leading-relaxed">
                {lyrics}
              </pre>
            </div>
          </div>
        )}

        <footer className="text-center text-sm text-gray-400 mt-8">
          <p>Powered by Lyrics.ovh API</p>
        </footer>
      </div>
    </div>
  );
}