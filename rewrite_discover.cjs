const fs = require('fs');

let content = fs.readFileSync('src/pages/DiscoverReels.jsx', 'utf8');

// 1. Add import
if (!content.includes('ReelsService')) {
  content = content.replace(
    "import EgLogo from '../components/common/EgLogo';",
    "import EgLogo from '../components/common/EgLogo';\nimport { ReelsService } from '../services/ReelsService';"
  );
}

// 2. Change const reelsList = [ ... ] to const DEFAULT_REELS = [ ... ]
content = content.replace(
  'const reelsList = [',
  'const DEFAULT_REELS = ['
);

// 3. Insert state inside the component
const componentStartRegex = /const DiscoverReels = \(\) => \{/;
content = content.replace(
  componentStartRegex,
  `const DiscoverReels = () => {
  const [reelsList, setReelsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    const fetchReels = async () => {
      try {
        const storedReels = await ReelsService.getReels();
        if (storedReels && storedReels.length > 0) {
          setReelsList(storedReels);
        } else {
          for (const reel of DEFAULT_REELS) {
            await ReelsService.saveReel(reel);
          }
          setReelsList(DEFAULT_REELS);
        }
      } catch (err) {
        console.error("Failed to load reels", err);
        setReelsList(DEFAULT_REELS);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReels();
  }, []);
`
);

// 4. In renderReelItem, we don't need to change much, just ensure it uses reelsList.
// Wait, if it's loading, we might want to return null or a spinner.
content = content.replace(
  'return (',
  `if (isLoading) return <div className="w-full h-full bg-black flex items-center justify-center text-white"><span className="material-symbols-outlined animate-spin text-4xl">sync</span></div>;\n\n  return (`
);

// 5. Connect the three dots to the edit modal
content = content.replace(
  'onClick={(e) => { e.stopPropagation(); /* Edit action */ }}',
  'onClick={(e) => { e.stopPropagation(); setIsEditModalOpen(true); }}'
);

// 6. Append the Edit Modal to the main return
// We'll append it just before the final `</div>`
const editModalHTML = `
      {isEditModalOpen && (
        <div className="absolute inset-0 z-[100] bg-black/90 flex flex-col pt-safe text-white">
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <h2 className="text-xl font-bold">Edit Reels Videos</h2>
            <button onClick={() => setIsEditModalOpen(false)} className="p-2 bg-white/10 rounded-full">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {reelsList.map((reel, index) => (
              <div key={reel.id} className="bg-white/5 rounded-2xl p-4 border border-white/10">
                <div className="flex gap-4 items-center mb-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-black shrink-0 relative">
                    {reel.videoBg.includes('.mp4') || reel.videoBg.startsWith('blob:') ? (
                      <video src={reel.videoBg} className="w-full h-full object-cover" />
                    ) : (
                      <img src={reel.videoBg} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-[14px]">{reel.caption.substring(0, 40)}...</h3>
                    <p className="text-[12px] text-gray-400">By {reel.creatorHandle}</p>
                  </div>
                </div>
                
                <label className="flex items-center justify-center w-full bg-[#d00000] hover:bg-red-600 active:scale-95 transition-all text-white font-bold py-2.5 rounded-xl cursor-pointer">
                  <span className="material-symbols-outlined mr-2">upload</span>
                  Upload New Video
                  <input 
                    type="file" 
                    accept="video/mp4,video/quicktime,video/webm" 
                    className="hidden" 
                    onChange={async (e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      const videoUrl = URL.createObjectURL(file);
                      
                      // Save to IndexedDB (convert to blob and store, or just store the blob itself?)
                      // It's better to store the File object itself in IndexedDB.
                      const updatedReel = { ...reel, videoBg: file };
                      await ReelsService.saveReel(updatedReel);
                      
                      // Update state (we use URL.createObjectURL for preview in memory)
                      const updatedReelsList = [...reelsList];
                      updatedReelsList[index] = { ...updatedReel, videoBg: videoUrl };
                      setReelsList(updatedReelsList);
                    }}
                  />
                </label>
              </div>
            ))}
          </div>
        </div>
      )}
`;

content = content.replace(
  '    </div>\n  );\n};',
  editModalHTML + '\n    </div>\n  );\n};'
);

fs.writeFileSync('src/pages/DiscoverReels.jsx', content);
console.log("Rewrote DiscoverReels.jsx");
