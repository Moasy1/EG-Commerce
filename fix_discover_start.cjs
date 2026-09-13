const fs = require('fs');
let content = fs.readFileSync('src/pages/DiscoverReels.jsx', 'utf8');

// The original rewrite script failed. 
// We want to replace `export default function DiscoverReels() {` with the new start.
content = content.replace(
  'export default function DiscoverReels() {',
  `export default function DiscoverReels() {
  const [reelsList, setReelsList] = useState(DEFAULT_REELS);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    const fetchReels = async () => {
      try {
        const storedReels = await ReelsService.getReels();
        if (storedReels && storedReels.length > 0) {
          const processedReels = storedReels.map(r => {
            if (r.videoBg instanceof File || r.videoBg instanceof Blob) {
              return { ...r, videoBg: URL.createObjectURL(r.videoBg) };
            }
            return r;
          });
          setReelsList(processedReels);
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
  }, []);`
);

// We need to add the modal right before the final `</div>\n  );`
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
                    {(reel.videoBg.includes('.mp4') || reel.videoBg.startsWith('blob:')) ? (
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
                      const updatedReel = { ...reel, videoBg: file };
                      await ReelsService.saveReel(updatedReel);
                      
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
      )}`;

// We need to insert this modal at the end of the return statement of DiscoverReels
content = content.replace(
  '    </div>\n  );\n}',
  editModalHTML + '\n    </div>\n  );\n}'
);

fs.writeFileSync('src/pages/DiscoverReels.jsx', content);
console.log("Fixed state and modal!");
