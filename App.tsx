import React, { useState, useEffect } from 'react';
import { GameStage, CharacterType, Character, CipherSymbol, ColoringPageType } from './types';
import { speak } from './services/audioService';
import { CharacterAvatar } from './components/CharacterAvatar';
import { ParentsModal } from './components/ParentsModal';
import { Play, RotateCcw, Info, Sun, Star, Heart, Check, Bird, PawPrint, Cat, TreePine, Circle, Square, Triangle, Apple, Banana, Grape, Rocket, Flower } from 'lucide-react';

const CHARACTERS: Character[] = [
  { id: CharacterType.BEAR, name: 'Mavi Ayı', color: 'bg-blue-400', secondaryColor: 'border-blue-600', description: 'Güçlü ve sevecen.', icon: null },
  { id: CharacterType.RABBIT, name: 'Sarı Tavşan', color: 'bg-yellow-300', secondaryColor: 'border-yellow-500', description: 'Hızlı ve neşeli.', icon: null },
  { id: CharacterType.CAT, name: 'Kırmızı Kedi', color: 'bg-red-400', secondaryColor: 'border-red-600', description: 'Oyunbaz ve zeki.', icon: null },
];

const CIPHER_SYMBOLS: CipherSymbol[] = [
  { id: 'sun', icon: <Sun size={40} />, color: 'bg-yellow-400', sound: 'Güneş' },
  { id: 'star', icon: <Star size={40} />, color: 'bg-indigo-400', sound: 'Yıldız' },
  { id: 'heart', icon: <Heart size={40} />, color: 'bg-red-400', sound: 'Kalp' },
];

const CIPHER_SOLUTION = ['sun', 'heart', 'star'];

// Data for the 3 rounds of logic puzzles
const LOGIC_ROUNDS = [
  {
    id: 1,
    theme: 'Şekiller',
    refs: [
      { id: 1, icon: <Circle size={40} className="text-blue-500" />, val: 1 },
      { id: 2, icon: <Square size={40} className="text-red-500" />, val: 2 },
      { id: 3, icon: <Triangle size={40} className="text-green-500" />, val: 3 },
    ],
    question: [2, 1, 3], // Square, Circle, Triangle
    options: [
      { val: [1, 2, 3], isCorrect: false },
      { val: [2, 1, 3], isCorrect: true },
      { val: [3, 2, 1], isCorrect: false },
    ]
  },
  {
    id: 2,
    theme: 'Meyveler',
    refs: [
      { id: 1, icon: <Apple size={40} className="text-red-500" />, val: 1 },
      { id: 2, icon: <Banana size={40} className="text-yellow-500" />, val: 2 },
      { id: 3, icon: <Grape size={40} className="text-purple-500" />, val: 3 },
    ],
    question: [3, 1, 2], // Grape, Apple, Banana
    options: [
      { val: [3, 1, 2], isCorrect: true },
      { val: [1, 3, 2], isCorrect: false },
      { val: [2, 3, 1], isCorrect: false },
    ]
  },
  {
    id: 3, // The original animal puzzle
    theme: 'Hayvanlar',
    refs: [
      { id: 1, icon: <Cat size={40} className="text-orange-500" />, val: 1 },
      { id: 2, icon: <PawPrint size={40} className="text-blue-500" />, val: 2 },
      { id: 3, icon: <Bird size={40} className="text-purple-500" />, val: 3 },
    ],
    question: [2, 1, 3], // Bear, Cat, Bird
    options: [
      { val: [1, 2, 3], isCorrect: false },
      { val: [2, 1, 3], isCorrect: true },
      { val: [3, 1, 2], isCorrect: false },
    ]
  }
];

export default function App() {
  const [stage, setStage] = useState<GameStage>(GameStage.INTRO);
  const [selectedChar, setSelectedChar] = useState<CharacterType | null>(null);
  const [adventureItemFound, setAdventureItemFound] = useState(false);
  const [cipherInput, setCipherInput] = useState<string[]>([]);
  const [showParentsModal, setShowParentsModal] = useState(false);
  const [cipherSuccess, setCipherSuccess] = useState(false);
  
  // Logic Puzzle State
  const [logicRoundIndex, setLogicRoundIndex] = useState(0); // 0, 1, 2
  const [logicPuzzleSuccess, setLogicPuzzleSuccess] = useState(false);
  
  // New games state
  const [shadowSuccess, setShadowSuccess] = useState(false);
  const [sizeSortSuccess, setSizeSortSuccess] = useState(false);

  // Coloring state
  const [selectedColoringPage, setSelectedColoringPage] = useState<ColoringPageType>(ColoringPageType.BEAR);
  const [fillColors, setFillColors] = useState({ part1: '#FFFFFF', part2: '#FFFFFF', part3: '#FFFFFF', bg: '#FFFFFF' });
  const [selectedBrushColor, setSelectedBrushColor] = useState('#EF4444'); 

  // Speak helper
  const speakText = (text: string) => {
    speak(text);
  };

  useEffect(() => {
    switch (stage) {
      case GameStage.INTRO:
        break;
      case GameStage.CHARACTER_SELECT:
        speakText("Hadi bir arkadaş seç! Mavi Ayı mı? Sarı Tavşan mı? Yoksa Kırmızı Kedi mi?");
        break;
      case GameStage.SHADOW_MATCH:
        speakText("Eyvah! Arkadaşımız karanlıkta kayboldu. Onun gölgesini bulabilir misin?");
        break;
      case GameStage.ADVENTURE:
        speakText("Şimdi ormandayız! Çalıların arasına saklanmış Kırmızı Kalbi bulabilir misin?");
        break;
      case GameStage.SIZE_SORT:
        speakText("Yolumuz kapanmış! Geçmek için en büyük ağaca dokunmalısın.");
        break;
      case GameStage.CIPHER:
        speakText("Harika! Sandığı açmak için şekil şifresini çöz. Güneş, Kalp ve Yıldız.");
        break;
      case GameStage.LOGIC_PUZZLE:
        speakText("Şimdi zeka oyunu zamanı! Yukarıdaki numaralara bak ve doğru sırayı bul.");
        break;
      case GameStage.REWARD_SELECT:
        speakText("Tebrikler şampiyon! Oyun bitti. Şimdi ödül zamanı. Hangisini boyamak istersin? Ayı mı, Roket mi, Çiçek mi?");
        break;
      case GameStage.REWARD_PAINT:
        speakText("İstediğin renkleri seç ve boyamaya başla!");
        break;
    }
  }, [stage]);

  const handleStart = () => {
    speakText("Merhaba küçük dostum! Hazır mısın? Hadi maceraya başlayalım!");
    setStage(GameStage.CHARACTER_SELECT);
  };

  const handleCharacterSelect = (char: CharacterType) => {
    setSelectedChar(char);
    const charName = CHARACTERS.find(c => c.id === char)?.name;
    speakText(`Harika seçim! ${charName} seninle oynamak için sabırsızlanıyor.`);
    setTimeout(() => {
      setStage(GameStage.SHADOW_MATCH);
    }, 2000);
  };

  const handleShadowClick = (clickedType: CharacterType) => {
    if (clickedType === selectedChar) {
      setShadowSuccess(true);
      speakText("Aferin! Arkadaşını buldun.");
      setTimeout(() => setStage(GameStage.ADVENTURE), 2500);
    } else {
      speakText("Hımmm, bu gölge ona benzemiyor. Tekrar dene!");
    }
  };

  const handleAdventureClick = (isTarget: boolean) => {
    if (isTarget) {
      setAdventureItemFound(true);
      speakText("Süpersin! Kalbi buldun. Devam edelim.");
      setTimeout(() => {
        setStage(GameStage.SIZE_SORT);
      }, 2500);
    } else {
      speakText("Bu o değil. Kırmızı kalbi arıyoruz.");
    }
  };

  const handleSizeClick = (size: 'sm' | 'md' | 'lg') => {
    if (size === 'lg') {
      setSizeSortSuccess(true);
      speakText("Doğru! En büyük ağaç bu. Yol açıldı!");
      setTimeout(() => setStage(GameStage.CIPHER), 2500);
    } else {
      speakText("Bu biraz küçük. Daha büyük bir ağaç var mı?");
    }
  };

  const handleCipherClick = (symbolId: string) => {
    const newInput = [...cipherInput, symbolId];
    setCipherInput(newInput);
    const symbol = CIPHER_SYMBOLS.find(s => s.id === symbolId);
    if (symbol) speak(symbol.sound);

    if (newInput.length === 3) {
      if (JSON.stringify(newInput) === JSON.stringify(CIPHER_SOLUTION)) {
        setCipherSuccess(true);
        speakText("Şifre doğru! Sandık açıldı. Ama içinden zorlu sorular çıktı!");
        setTimeout(() => setStage(GameStage.LOGIC_PUZZLE), 3000);
      } else {
        speakText("Eyvah, şifre yanlış. Tekrar deneyelim: Güneş, Kalp, Yıldız.");
        setTimeout(() => setCipherInput([]), 2000);
      }
    }
  };

  // --- UPDATED LOGIC PUZZLE HANDLER (3 ROUNDS) ---
  const handleLogicPuzzleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      setLogicPuzzleSuccess(true);
      
      if (logicRoundIndex < 2) {
        // More rounds to go
        speakText("Doğru bildin! Hadi bir sonrakine geçelim.");
        setTimeout(() => {
          setLogicPuzzleSuccess(false);
          setLogicRoundIndex(prev => prev + 1);
        }, 2000);
      } else {
        // All rounds done
        speakText("İnanılmazsın! Tüm soruları bildin.");
        setTimeout(() => setStage(GameStage.REWARD_SELECT), 2500);
      }
    } else {
      speakText("Hımmm, tekrar dene. Yukarıdaki resimlere dikkatli bak.");
    }
  };

  const handleColoringPageSelect = (page: ColoringPageType) => {
    setSelectedColoringPage(page);
    setStage(GameStage.REWARD_PAINT);
  };

  const resetGame = () => {
    setStage(GameStage.INTRO);
    setSelectedChar(null);
    setAdventureItemFound(false);
    setCipherInput([]);
    setCipherSuccess(false);
    setLogicPuzzleSuccess(false);
    setLogicRoundIndex(0);
    setShadowSuccess(false);
    setSizeSortSuccess(false);
    setFillColors({ part1: '#FFFFFF', part2: '#FFFFFF', part3: '#FFFFFF', bg: '#FFFFFF' });
  };

  // --- RENDERERS ---

  const renderIntro = () => (
    <div className="flex flex-col items-center justify-center h-full text-center space-y-8 animate-float">
      <h1 className="text-6xl font-bold text-white drop-shadow-lg">KÜÇÜK KÂŞİFLER</h1>
      <button 
        onClick={handleStart}
        className="group relative bg-green-500 hover:bg-green-400 text-white text-4xl font-bold py-8 px-12 rounded-3xl border-b-8 border-green-700 active:border-b-0 active:translate-y-2 transition-all shadow-2xl"
      >
        <div className="flex items-center gap-4">
          <Play size={48} fill="white" />
          <span>OYNA</span>
        </div>
      </button>
    </div>
  );

  const renderCharacterSelect = () => (
    <div className="flex flex-col items-center h-full pt-10">
      <h2 className="text-4xl font-bold text-white mb-12 drop-shadow-md">Karakterini Seç</h2>
      <div className="flex gap-8 flex-wrap justify-center">
        {CHARACTERS.map((char) => (
          <div key={char.id} className="flex flex-col items-center gap-4">
             <CharacterAvatar 
               type={char.id} 
               size="xl" 
               onClick={() => handleCharacterSelect(char.id)}
             />
             <span className="text-2xl font-bold text-white bg-black/30 px-4 py-1 rounded-full">{char.name}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderShadowMatch = () => {
    const shadows = [CharacterType.BEAR, CharacterType.CAT, CharacterType.RABBIT];
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h2 className="text-3xl font-bold text-white mb-8 bg-black/20 px-6 py-2 rounded-full text-center">
          Hangi gölge senin arkadaşının?
        </h2>
        <div className="flex gap-8 justify-center items-center">
           {shadows.map(type => (
             <button
               key={type}
               onClick={() => handleShadowClick(type)}
               className="transition-transform hover:scale-110 p-4 bg-white/10 rounded-3xl"
             >
                <div className="brightness-0 contrast-200 opacity-80">
                  <CharacterAvatar type={type} size="lg" className="pointer-events-none bg-transparent border-0 shadow-none" />
                </div>
             </button>
           ))}
        </div>
        {shadowSuccess && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-10">
            <div className="text-6xl text-white font-bold animate-bounce text-center">Bildin!</div>
          </div>
        )}
      </div>
    );
  };

  const renderAdventure = () => (
    <div className="relative w-full h-full">
      <div className="absolute top-10 left-10 w-24 h-24 bg-green-700 rounded-full opacity-60"></div>
      <div className="absolute bottom-20 right-20 w-32 h-32 bg-green-800 rounded-full opacity-60"></div>
      <div className="flex flex-col items-center pt-8 pointer-events-none">
        <h2 className="text-3xl font-bold text-white bg-black/20 px-6 py-2 rounded-full">Kırmızı Kalbi Bul!</h2>
      </div>
      <button onClick={() => handleAdventureClick(false)} className="absolute top-1/3 left-1/4 w-24 h-24 bg-blue-500 rounded-full shadow-lg border-4 border-white hover:scale-110 transition-transform"></button>
      <button onClick={() => handleAdventureClick(false)} className="absolute bottom-1/3 right-1/4 w-0 h-0 border-l-[60px] border-l-transparent border-b-[100px] border-b-yellow-400 border-r-[60px] border-r-transparent hover:scale-110 transition-transform filter drop-shadow-lg"></button>
      <button onClick={() => handleAdventureClick(true)} className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ${adventureItemFound ? 'scale-150 rotate-12' : 'hover:scale-110'}`}>
        <Heart size={96} fill="#EF4444" color="#7F1D1D" strokeWidth={3} />
      </button>
      {adventureItemFound && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-10">
          <div className="text-6xl text-white font-bold animate-bounce">Harika!</div>
        </div>
      )}
    </div>
  );

  const renderSizeSort = () => (
    <div className="flex flex-col items-center justify-center h-full">
        <h2 className="text-3xl font-bold text-white mb-10 bg-black/20 px-6 py-2 rounded-full text-center">En Büyük Ağacı Bul!</h2>
        <div className="flex items-end justify-center gap-8 w-full px-4">
            <button onClick={() => handleSizeClick('sm')} className="group flex flex-col items-center transition-transform hover:scale-110"><TreePine size={64} className="text-emerald-800 fill-emerald-600 drop-shadow-xl" /></button>
            <button onClick={() => handleSizeClick('lg')} className="group flex flex-col items-center transition-transform hover:scale-105"><TreePine size={180} className="text-emerald-900 fill-emerald-700 drop-shadow-2xl animate-bounce-slow" /></button>
            <button onClick={() => handleSizeClick('md')} className="group flex flex-col items-center transition-transform hover:scale-110"><TreePine size={100} className="text-emerald-800 fill-emerald-600 drop-shadow-xl" /></button>
        </div>
        {sizeSortSuccess && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-10">
            <div className="text-6xl text-white font-bold animate-bounce">Kocaman!</div>
          </div>
        )}
      </div>
  );

  const renderCipher = () => (
    <div className="flex flex-col items-center justify-center h-full gap-8">
      <h2 className="text-3xl font-bold text-white mb-4 text-center max-w-lg">Sandık Şifresi: <br/> <span className="text-yellow-200">Güneş -> Kalp -> Yıldız</span></h2>
      <div className="flex gap-4 mb-8 bg-black/20 p-6 rounded-2xl min-h-[100px] items-center">
        {cipherInput.map((symbolId, idx) => {
          const sym = CIPHER_SYMBOLS.find(s => s.id === symbolId);
          return (<div key={idx} className="bg-white p-2 rounded-full animate-bounce-slow">{sym?.icon}</div>);
        })}
        {Array.from({length: 3 - cipherInput.length}).map((_, i) => (<div key={i} className="w-14 h-14 border-4 border-dashed border-white/50 rounded-full"></div>))}
      </div>
      <div className="flex gap-6">
        {CIPHER_SYMBOLS.map((s) => (
          <button key={s.id} onClick={() => handleCipherClick(s.id)} disabled={cipherSuccess} className={`${s.color} p-6 rounded-2xl shadow-xl border-b-8 border-black/20 active:border-b-0 active:translate-y-2 transition-all`}>
            <div className="text-white">{s.icon}</div>
          </button>
        ))}
      </div>
      {cipherSuccess && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-green-500 text-white p-8 rounded-3xl shadow-2xl z-20 animate-bounce">
          <Check size={64} className="mx-auto"/>
        </div>
      )}
    </div>
  );

  const renderLogicPuzzle = () => {
    const currentRound = LOGIC_ROUNDS[logicRoundIndex];

    return (
      <div className="flex flex-col items-center h-full p-4 pt-8">
        <h2 className="text-3xl font-bold text-white mb-2 text-center">Zeka Oyunu {logicRoundIndex + 1}/3</h2>
        <p className="text-white/80 mb-6">{currentRound.theme}</p>

        {/* Reference Table */}
        <div className="flex gap-6 mb-8 bg-white/20 p-4 rounded-3xl">
          {currentRound.refs.map((ref) => (
            <div key={ref.id} className="flex flex-col items-center bg-white p-3 rounded-2xl w-24 shadow-md">
              <div className="mb-2">{ref.icon}</div>
              <span className="text-4xl font-bold text-slate-800">{ref.val}</span>
            </div>
          ))}
        </div>

        {/* Question Equation */}
        <div className="flex items-center gap-4 mb-8 bg-black/10 p-4 rounded-2xl">
           {currentRound.question.map((qId, idx) => {
             const refItem = currentRound.refs.find(r => r.val === qId);
             return (
               <div key={idx} className="bg-white p-4 rounded-2xl border-4 border-blue-300">
                  {refItem?.icon}
               </div>
             );
           })}
           <div className="text-6xl font-bold text-white">= ?</div>
        </div>

        {/* Options */}
        <div className="grid grid-cols-3 gap-6 w-full max-w-2xl">
          {currentRound.options.map((opt, idx) => (
             <button 
               key={idx}
               onClick={() => handleLogicPuzzleAnswer(opt.isCorrect)}
               className={`
                 bg-white hover:bg-blue-50 
                 p-6 rounded-3xl border-b-8 border-gray-300 
                 active:border-b-0 active:translate-y-2 transition-all 
                 flex justify-center gap-2
                 ${logicPuzzleSuccess && opt.isCorrect ? 'ring-4 ring-green-500 scale-105' : ''}
               `}
            >
              {opt.val.map((v) => (
                 <span key={v} className="text-4xl font-bold text-slate-700 w-8">{v}</span>
              ))}
            </button>
          ))}
        </div>

        {logicPuzzleSuccess && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-10">
            <div className="text-6xl text-white font-bold animate-bounce text-center">
               {logicRoundIndex === 2 ? 'Şampiyon!' : 'Doğru!'}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderRewardSelect = () => {
     return (
        <div className="flex flex-col items-center justify-center h-full">
           <h2 className="text-4xl font-bold text-white mb-12 drop-shadow-md text-center">Ne Boyamak İstersin?</h2>
           <div className="flex gap-8 flex-wrap justify-center">
              
              <button 
                 onClick={() => handleColoringPageSelect(ColoringPageType.BEAR)}
                 className="bg-white p-6 rounded-3xl shadow-xl hover:scale-105 transition-transform flex flex-col items-center gap-4 border-b-8 border-blue-200"
              >
                 <PawPrint size={80} className="text-blue-500" />
                 <span className="text-2xl font-bold text-slate-700">Sevimli Ayı</span>
              </button>

              <button 
                 onClick={() => handleColoringPageSelect(ColoringPageType.ROCKET)}
                 className="bg-white p-6 rounded-3xl shadow-xl hover:scale-105 transition-transform flex flex-col items-center gap-4 border-b-8 border-purple-200"
              >
                 <Rocket size={80} className="text-purple-500" />
                 <span className="text-2xl font-bold text-slate-700">Uzay Roketi</span>
              </button>

              <button 
                 onClick={() => handleColoringPageSelect(ColoringPageType.FLOWER)}
                 className="bg-white p-6 rounded-3xl shadow-xl hover:scale-105 transition-transform flex flex-col items-center gap-4 border-b-8 border-pink-200"
              >
                 <Flower size={80} className="text-pink-500" />
                 <span className="text-2xl font-bold text-slate-700">Güzel Çiçek</span>
              </button>

           </div>
        </div>
     );
  };

  const renderRewardPaint = () => {
    const brushColors = ['#EF4444', '#3B82F6', '#EAB308', '#22C55E', '#A855F7', '#FFFFFF', '#000000'];

    // SVG Generators
    const renderBearSVG = () => (
      <svg width="300" height="400" viewBox="0 0 300 400" className="drop-shadow-xl">
         {/* Background rect for easy clicking of "sky" if needed, but keeping simple */}
         <path d="M220 150 Q 220 250 200 300" stroke="black" strokeWidth="2" fill="none" />
         <path 
           d="M220 150 A 40 45 0 0 0 180 110 A 40 45 0 0 0 220 150"
           fill={fillColors.part1} stroke="black" strokeWidth="3"
           className="cursor-pointer hover:opacity-90 transition-colors"
           onClick={() => setFillColors({...fillColors, part1: selectedBrushColor})}
         />
         <circle cx="220" cy="100" r="50" fill={fillColors.part1} stroke="black" strokeWidth="3" 
           onClick={() => setFillColors({...fillColors, part1: selectedBrushColor})}
           className="cursor-pointer transition-colors"
         />

         <rect 
            x="100" y="250" width="100" height="120" rx="20" 
            fill={fillColors.part2} stroke="black" strokeWidth="3"
            onClick={() => setFillColors({...fillColors, part2: selectedBrushColor})}
            className="cursor-pointer transition-colors"
         />
         
         <circle 
            cx="150" cy="200" r="60" 
            fill={fillColors.part3} stroke="black" strokeWidth="3"
            onClick={() => setFillColors({...fillColors, part3: selectedBrushColor})}
            className="cursor-pointer transition-colors"
         />
         
         <circle cx="130" cy="190" r="5" fill="black" />
         <circle cx="170" cy="190" r="5" fill="black" />
         <path d="M140 220 Q 150 230 160 220" stroke="black" strokeWidth="3" fill="none" />
      </svg>
    );

    const renderRocketSVG = () => (
      <svg width="300" height="400" viewBox="0 0 300 400" className="drop-shadow-xl">
          {/* Wings */}
          <path d="M80 300 L 40 380 L 100 340 Z" fill={fillColors.part2} stroke="black" strokeWidth="3" onClick={() => setFillColors({...fillColors, part2: selectedBrushColor})} className="cursor-pointer"/>
          <path d="M220 300 L 260 380 L 200 340 Z" fill={fillColors.part2} stroke="black" strokeWidth="3" onClick={() => setFillColors({...fillColors, part2: selectedBrushColor})} className="cursor-pointer"/>
          
          {/* Body */}
          <rect x="100" y="100" width="100" height="240" rx="10" fill={fillColors.part1} stroke="black" strokeWidth="3" onClick={() => setFillColors({...fillColors, part1: selectedBrushColor})} className="cursor-pointer"/>
          
          {/* Top */}
          <path d="M100 100 L 150 20 L 200 100 Z" fill={fillColors.part3} stroke="black" strokeWidth="3" onClick={() => setFillColors({...fillColors, part3: selectedBrushColor})} className="cursor-pointer"/>
          
          {/* Window */}
          <circle cx="150" cy="180" r="30" fill={fillColors.part3} stroke="black" strokeWidth="3" onClick={() => setFillColors({...fillColors, part3: selectedBrushColor})} className="cursor-pointer"/>
      </svg>
    );

    const renderFlowerSVG = () => (
      <svg width="300" height="400" viewBox="0 0 300 400" className="drop-shadow-xl">
          {/* Stem */}
          <rect x="145" y="200" width="10" height="150" fill="green" stroke="black" strokeWidth="2" />
          <path d="M150 300 Q 200 280 200 250 Q 180 280 155 310" fill="lightgreen" stroke="black" strokeWidth="2" />

          {/* Petals (Part 1) */}
          <circle cx="150" cy="100" r="40" fill={fillColors.part1} stroke="black" strokeWidth="3" onClick={() => setFillColors({...fillColors, part1: selectedBrushColor})} className="cursor-pointer"/>
          <circle cx="190" cy="140" r="40" fill={fillColors.part1} stroke="black" strokeWidth="3" onClick={() => setFillColors({...fillColors, part1: selectedBrushColor})} className="cursor-pointer"/>
          <circle cx="190" cy="220" r="40" fill={fillColors.part1} stroke="black" strokeWidth="3" onClick={() => setFillColors({...fillColors, part1: selectedBrushColor})} className="cursor-pointer"/>
          <circle cx="110" cy="220" r="40" fill={fillColors.part1} stroke="black" strokeWidth="3" onClick={() => setFillColors({...fillColors, part1: selectedBrushColor})} className="cursor-pointer"/>
          <circle cx="110" cy="140" r="40" fill={fillColors.part1} stroke="black" strokeWidth="3" onClick={() => setFillColors({...fillColors, part1: selectedBrushColor})} className="cursor-pointer"/>

          {/* Center (Part 2) */}
          <circle cx="150" cy="180" r="35" fill={fillColors.part2} stroke="black" strokeWidth="3" onClick={() => setFillColors({...fillColors, part2: selectedBrushColor})} className="cursor-pointer"/>
      </svg>
    );

    return (
      <div className="flex flex-col items-center h-full pt-4">
        <h2 className="text-3xl font-bold text-white mb-4">Boyama Zamanı!</h2>
        
        <div className="flex flex-row gap-8 items-start">
          <div className="flex flex-col gap-4 bg-white/80 p-4 rounded-2xl shadow-lg">
            {brushColors.map(c => (
              <button
                key={c}
                onClick={() => {
                  setSelectedBrushColor(c);
                  speakText("Renk seçildi.");
                }}
                className={`w-12 h-12 rounded-full border-4 ${selectedBrushColor === c ? 'border-black scale-110' : 'border-gray-200'}`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-2xl">
             {selectedColoringPage === ColoringPageType.BEAR && renderBearSVG()}
             {selectedColoringPage === ColoringPageType.ROCKET && renderRocketSVG()}
             {selectedColoringPage === ColoringPageType.FLOWER && renderFlowerSVG()}
          </div>
        </div>

        <button onClick={resetGame} className="mt-8 bg-white text-blue-600 px-8 py-3 rounded-full font-bold shadow-lg flex items-center gap-2 hover:scale-105 transition-transform">
          <RotateCcw size={20} />
          Baştan Oyna
        </button>
      </div>
    );
  };

  const getBackground = () => {
    switch (stage) {
      case GameStage.INTRO: return 'bg-gradient-to-b from-sky-400 to-sky-600';
      case GameStage.CHARACTER_SELECT: return 'bg-gradient-to-b from-purple-400 to-purple-600';
      case GameStage.SHADOW_MATCH: return 'bg-gradient-to-b from-slate-600 to-slate-800';
      case GameStage.ADVENTURE: return 'bg-gradient-to-b from-green-400 to-emerald-700';
      case GameStage.SIZE_SORT: return 'bg-gradient-to-b from-teal-400 to-teal-700';
      case GameStage.CIPHER: return 'bg-gradient-to-b from-orange-400 to-orange-600';
      case GameStage.LOGIC_PUZZLE: return 'bg-gradient-to-b from-indigo-500 to-indigo-800';
      case GameStage.REWARD_SELECT: return 'bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-500';
      case GameStage.REWARD_PAINT: return 'bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400';
      default: return 'bg-gray-100';
    }
  };

  return (
    <div className={`w-full h-screen ${getBackground()} overflow-hidden transition-colors duration-1000 relative select-none`}>
      <button 
        onClick={() => setShowParentsModal(true)}
        className="absolute top-4 right-4 z-40 bg-white/20 p-2 rounded-full hover:bg-white/40 transition-colors"
        title="Ebeveyn Bilgisi"
      >
        <Info className="text-white" />
      </button>

      <main className="w-full h-full max-w-5xl mx-auto p-4">
        {stage === GameStage.INTRO && renderIntro()}
        {stage === GameStage.CHARACTER_SELECT && renderCharacterSelect()}
        {stage === GameStage.SHADOW_MATCH && renderShadowMatch()}
        {stage === GameStage.ADVENTURE && renderAdventure()}
        {stage === GameStage.SIZE_SORT && renderSizeSort()}
        {stage === GameStage.CIPHER && renderCipher()}
        {stage === GameStage.LOGIC_PUZZLE && renderLogicPuzzle()}
        {stage === GameStage.REWARD_SELECT && renderRewardSelect()}
        {stage === GameStage.REWARD_PAINT && renderRewardPaint()}
      </main>

      {showParentsModal && <ParentsModal onClose={() => setShowParentsModal(false)} />}
    </div>
  );
}