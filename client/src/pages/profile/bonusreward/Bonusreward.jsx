import React, { useState, useEffect, useContext } from 'react';
import { MdArrowBackIosNew, MdInfoOutline, MdCheckCircle, MdClose } from 'react-icons/md';
import { GiTrophy } from 'react-icons/gi';
import { FaClock } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../../context/UserContext';
import { LanguageContext } from '../../../context/LanguageContext';
import bonusimg1 from "../../../assets/bonus/bonus1.png";
import bonusimg2 from "../../../assets/bonus/bonus2.png";
import bonusimg3 from "../../../assets/bonus/bonus3.png";
import bonusimg4 from "../../../assets/bonus/bonus4.png";

/* ─────────────── LEVEL CONFIG ─────────────── */
const LEVELS = [
  { name: 'Bronze',   threshold: 0 },
  { name: 'Silver',   threshold: 10000 },
  { name: 'Gold',     threshold: 50000 },
  { name: 'Platinum', threshold: 200000 },
  { name: 'Diamond',  threshold: 1000000 },
];

function getLevelData(bet = 0) {
  let cur = LEVELS[0], nxt = LEVELS[1];
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (bet >= LEVELS[i].threshold) {
      cur = LEVELS[i];
      nxt = LEVELS[i + 1] || null;
      break;
    }
  }
  const pct = nxt
    ? Math.min(100, Math.round(((bet - cur.threshold) / (nxt.threshold - cur.threshold)) * 100))
    : 100;
  return { cur, nxt, pct, bet };
}

/* ─────────────── HELPERS ─────────────── */
function calcTL(target) {
  const diff = new Date(target) - new Date();
  if (diff <= 0) return { d: 0, h: 0, m: 0, s: 0 };
  return {
    d: Math.floor(diff / 86400000),
    h: Math.floor((diff % 86400000) / 3600000),
    m: Math.floor((diff % 3600000) / 60000),
    s: Math.floor((diff % 60000) / 1000),
  };
}
const pad = n => String(n).padStart(2, '0');

function nextTue() {
  const d = new Date(), day = d.getDay();
  const t = new Date(d);
  t.setDate(d.getDate() + (day <= 2 ? 2 - day : 9 - day));
  t.setHours(0, 0, 0, 0);
  return t;
}
function next4th() {
  const d = new Date();
  const t = d.getDate() < 4
    ? new Date(d.getFullYear(), d.getMonth(), 4)
    : new Date(d.getFullYear(), d.getMonth() + 1, 4);
  t.setHours(0, 0, 0, 0);
  return t;
}

const imgFor = type => ({
  birthday: bonusimg1, anniversary: bonusimg1, celebration: bonusimg1,
  festival: bonusimg2, special_event: bonusimg2,
  holiday: bonusimg3, thank_you: bonusimg4,
}[type] || bonusimg1);

/* ─────────────── RING (level progress) ─────────────── */
function Ring({ pct }) {
  const R = 26, C = 2 * Math.PI * R;
  const dash = (pct / 100) * C;
  return (
    <div className="relative flex-shrink-0" style={{ width: 66, height: 66 }}>
      <svg width="66" height="66" viewBox="0 0 66 66" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="33" cy="33" r={R} fill="none" stroke="#dde8ec" strokeWidth="5" />
        <circle
          cx="33" cy="33" r={R} fill="none"
          stroke="#0bbcd4" strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${C}`}
          style={{ transition: 'stroke-dasharray .6s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-extrabold" style={{ color: '#0bbcd4' }}>{pct}%</span>
      </div>
    </div>
  );
}

/* ─────────────── BONUS CARD ─────────────── */
function BonusCard({ tag, title, desc, rows, img, canClaim, claimed, loading, onClaim }) {
  return (
    <div
      className="relative mb-5 rounded-[40px] overflow-visible"
      style={{
        // EXACT BACKGROUND: Matches the soft cyan-to-white look
        background: 'linear-gradient(135deg, #e0f7fa 0%, #ffffff 100%)',
        border: '2px solid #81d4fa',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
      }}
    >
      <div className="rounded-[38px] p-6">
        {/* Main content flex container */}
        <div className="flex justify-between items-center gap-4">
          
          {/* LEFT CONTENT */}
          <div className="flex-1">
            {/* Tag / Pill */}
            <span
              className="inline-block text-xs border border-orange-200 font-medium rounded-full px-5 py-1.5 mb-4"
              style={{
                background: '#ffffff',
                color: '#607d8b',
              }}
            >
              {tag}
            </span>

            {/* Title */}
            <h2
              className="font-bold mb-3 text-[#0d2b35]"
              style={{ fontSize: '20px', lineHeight: '1.2' }}
            >
              {title}
            </h2>

            {/* Data Rows */}
            <div className="grid gap-y-1" style={{ gridTemplateColumns: 'auto 1fr', columnGap: '18px' }}>
              {rows.map(([k, v, isTimer]) => (
                <React.Fragment key={k}>
                  <span className="text-xs text-[#527380] whitespace-nowrap">{k}</span>
                  <span
                    className="text-xs font-bold"
                    style={{
                      color: isTimer ? '#ff8a80' : '#112030',
                    }}
                  >
                    {v}
                  </span>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* RIGHT IMAGE: No absolute positioning, standard flow */}
          <div className="flex-shrink-0">
            <img
              src={img}
              alt="bonus"
              className="w-[160px] h-auto object-contain"
              style={{ filter: 'drop-shadow(0 12px 20px rgba(0,0,0,0.15))' }}
            />
          </div>
        </div>

        {/* CLAIM BUTTON */}
        <div className="mt-6 flex justify-center">
          {claimed ? (
            <div className="flex items-center gap-2 text-green-600 font-bold py-3">
              <MdCheckCircle /> Already Claimed
            </div>
          ) : (
            <button
              onClick={onClaim}
              disabled={loading}
              className="w-[75%] py-3 text-white font-bold rounded-2xl transition-all active:scale-95"
              style={{
                background: 'linear-gradient(to right, #00bad4, #00d4eb)',
                // EXACT BUTTON SHADOW: The cyan glow from the image
                boxShadow: '0 8px 22px rgba(0, 186, 212, 0.45)',
                border: 'none',
                fontSize: '17px',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.8 : 1
              }}
            >
              {loading ? 'Claiming…' : 'Claim Bonus'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────────── MINI ROW (claimed / expired) ─────────────── */
function MiniRow({ img, title, sub, amount, dimmed, strike }) {
  return (
    <div
      className="flex items-center bg-white border border-slate-100 rounded-2xl px-4 py-3 mb-2"
      style={{ opacity: dimmed ? 0.5 : 1 }}
    >
      <img src={img} alt="" className="w-9 h-9 object-contain mr-3" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-800 truncate">{title}</p>
        <p className="text-xs text-slate-400">{sub}</p>
      </div>
      <span
        className="text-sm font-bold ml-3 flex-shrink-0"
        style={{
          color: dimmed ? '#94a3b8' : '#22c55e',
          textDecoration: strike ? 'line-through' : 'none',
        }}
      >
        {amount}
      </span>
    </div>
  );
}

/* ─────────────── MAIN COMPONENT ─────────────── */
const BonusCollection = () => {
  const { userData, fetchUserData } = useUser();
  const navigate = useNavigate();
    const { t, language } = useContext(LanguageContext);
  const [loading,        setLoading]        = useState(true);
  const [refreshing,     setRefreshing]     = useState(false);
  const [weekly,         setWeekly]         = useState(null);
  const [monthly,        setMonthly]        = useState(null);
  const [cash,           setCash]           = useState([]);
  const [depositBonuses, setDepositBonuses] = useState([]);
  const [depositBonusLoading, setDepositBonusLoading] = useState(false);
  const [error,          setError]          = useState(null);
  const [fb,             setFb]             = useState({ type: '', msg: '' });
  const [wTL,            setWTL]            = useState({ d: 0, h: 0, m: 0, s: 0 });
  const [mTL,            setMTL]            = useState({ d: 0, h: 0, m: 0, s: 0 });

  const base  = import.meta.env.VITE_API_KEY_Base_URL;
  const isTue = () => new Date().getDay()  === 2;
  const is4   = () => new Date().getDate() === 4;

  const fmt   = n => new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n || 0);
  const fmtD  = d => d ? new Date(d).toLocaleDateString('en-US') : 'N/A';
  const hdrs  = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}`, userId: userData._id });

  const fetchAll = async () => {
    try {
      if (!refreshing) setLoading(true);
      const [bR, cR] = await Promise.all([
        axios.get(`${base}/user/bonus/monthly-weekly/${userData._id}`, { headers: hdrs() }),
        axios.get(`${base}/user/cash-bonus/list/${userData._id}`,       { headers: hdrs() }),
      ]);
      if (bR.data.success) {
        const data = bR.data.data || [];
        const w = data.find(b => b.type === 'weekly');
        const m = data.find(b => b.type === 'monthly');
        setWeekly( w ? { ...w,  canClaim: isTue() && w.status === 'unclaimed' } : null);
        setMonthly(m ? { ...m, canClaim: is4()   && m.status === 'unclaimed' } : null);
      }
      if (cR.data.success) setCash(cR.data.data || []);
      setError(null);
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to load bonuses');
    } finally { setLoading(false); setRefreshing(false); }
  };

  /* ── fetch deposit bonuses (same API as Deposit page) ── */
  const fetchDepositBonuses = async () => {
    try {
      setDepositBonusLoading(true);
      const user  = JSON.parse(localStorage.getItem('user'));
      const token = localStorage.getItem('token');
      if (!user || !user._id) return;
      const response = await axios.get(`${base}/user/bonuses/available`, {
        headers: { Authorization: `Bearer ${token}` },
        params:  { userid: user._id },
      });
      if (response.data) setDepositBonuses(response.data.data || []);
    } catch (err) {
      console.error('Error fetching deposit bonuses:', err);
    } finally {
      setDepositBonusLoading(false);
    }
  };

  const toast = (type, msg) => {
    setFb({ type, msg });
    setTimeout(() => setFb({ type: '', msg: '' }), 3000);
  };

  const claimB = async (id, label) => {
    try {
      setLoading(true);
      const r = await axios.post(
        `${base}/user/bonus/claim/${userData._id}`,
        { bonusId: id },
        { headers: { ...hdrs(), 'Content-Type': 'application/json' } }
      );
      if (r.data.success) {
        toast('success', `${label} bonus claimed! +${fmt(r.data.data?.amount)} ৳`);
        await fetchAll(); await fetchUserData();
      } else toast('error', r.data.message || 'Failed');
    } catch (e) { toast('error', e.response?.data?.message || 'Failed'); }
    finally { setLoading(false); }
  };

  const claimC = async (id) => {
    try {
      setLoading(true);
      const r = await axios.post(
        `${base}/user/cash-bonus/claim/${id}`, {},
        { headers: { ...hdrs(), 'Content-Type': 'application/json' } }
      );
      if (r.data.success) {
        toast('success', r.data.message);
        await fetchAll(); await fetchUserData();
      } else toast('error', r.data.message || 'Failed');
    } catch (e) { toast('error', e.response?.data?.message || 'Failed'); }
    finally { setLoading(false); }
  };

  /* countdown tick */
  useEffect(() => {
    const tick = () => { setWTL(calcTL(nextTue())); setMTL(calcTL(next4th())); };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (userData?._id) {
      fetchAll();
      fetchDepositBonuses();
    }
  }, [userData]);

  const ld     = getLevelData(userData?.lifetime_bet || 0);
  const wExp   = `${pad(wTL.d)}D:${pad(wTL.h)}H:${pad(wTL.m)}M:${pad(wTL.s)}S`;
  const mExp   = `${pad(mTL.d)}D:${pad(mTL.h)}H:${pad(mTL.m)}M:${pad(mTL.s)}S`;
  const availC = cash.filter(b => b.canClaim === true);
  const clmdC  = cash.filter(b => b.userStatus === 'claimed');
  const expC   = cash.filter(b => b.isExpired === true);

  /* ── LOADING STATE ── */
  if (loading && !refreshing) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        {/* header */}
        <header className="sticky top-0 z-50 bg-white border-b border-slate-100 h-14 flex items-center justify-between px-4">
          <button onClick={() => navigate(-1)} className="w-9 h-9 flex items-center justify-center rounded-full">
            <MdArrowBackIosNew className="text-slate-600 text-lg" />
          </button>
          <span className="absolute left-14 text-2xl font-extrabold text-slate-900 tracking-tight">Bonus Hub</span>
          <button onClick={() => navigate(-1)} className="w-9 h-9 flex items-center justify-center rounded-full">
            <MdClose className="text-slate-600 text-xl" />
          </button>
        </header>
        <div className="flex-1 flex flex-col items-center justify-center">
          <div
            className="w-11 h-11 rounded-full border-4 border-slate-200"
            style={{ borderTopColor: '#0bbcd4', animation: 'spin .8s linear infinite' }}
          />
          <p className="text-slate-400 mt-4 text-sm">Loading bonuses…</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-anek">

      {/* ══════════════ HEADER ══════════════ */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-100 h-14 flex items-center justify-between px-4">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-50 transition-colors"
        >
          <MdArrowBackIosNew className="text-slate-600 text-lg" />
        </button>
        <span className="absolute left-14 text-xl font-bold text-slate-900 tracking-tight">
          Bonus Hub
        </span>
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-50 transition-colors"
        >
          <MdClose className="text-slate-600 text-xl" />
        </button>
      </header>

      {/* ══════════════ TOAST ══════════════ */}
      {fb.msg && (
        <div
          className={`mx-4 mt-3 px-4 py-3 rounded-xl border text-sm font-medium flex items-center gap-2 ${
            fb.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
          style={{ animation: 'fadeIn .3s ease' }}
        >
          {fb.type === 'success'
            ? <MdCheckCircle className="text-green-500 text-lg flex-shrink-0" />
            : <MdInfoOutline  className="text-red-500 text-lg flex-shrink-0" />}
          {fb.msg}
        </div>
      )}

      {/* ══════════════ CONTENT ══════════════ */}
      <div className="max-w-lg mx-auto px-4 pb-12">

        {/* ── LEVEL PROGRESS CARD ── */}
        <div className="mt-4 bg-white border border-theme_color2 rounded-2xl px-5 py-4 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-base font-medium text-slate-800">Your Level Progress</p>
            <p className="text-xs text-slate-500 mt-0.5">
              {ld.nxt ? `Next Level ${ld.nxt.name}` : 'Max Level Reached!'}
            </p>
          </div>
          <Ring pct={ld.pct} />
        </div>

        {/* error */}
        {error && (
          <div className="mt-3 px-4 py-3 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between text-sm">
            <span className="text-red-700">{error}</span>
            <button
              onClick={fetchAll}
              className="text-cyan-500 font-medium text-xs ml-3"
            >
              Retry
            </button>
          </div>
        )}

        {/* ── SECTION TITLE ── */}
        <p className="text-xl font-bold text-slate-900 tracking-tight mt-6 mb-4">
          { t.unlockableBonuses || 'Unlockable Bonuses'}
        </p>

        {/* ── WEEKLY BONUS CARD ── */}
        {weekly && (
          <BonusCard
            tag="Weekly Bonus"
            title="Get Your Weekly Reward"
            rows={[
              ['Wager',           weekly.wager_requirement ?? 'No conditions', false],
              ['Max.Bonus',       weekly.max_amount ? fmt(weekly.max_amount) : 'No Limit', false],
              ['Expiration Time', weekly.status === 'claimed' ? '—' : isTue() ? 'Available Today!' : wExp, true],
            ]}
            img={bonusimg2}
            canClaim={weekly.canClaim}
            claimed={weekly.status === 'claimed'}
            loading={loading}
            onClaim={() => claimB(weekly._id, 'Weekly')}
          />
        )}

        {/* ── MONTHLY BONUS CARD ── */}
        {monthly && (
          <BonusCard
            tag="Monthly Bonus"
            title="Get Your Monthly Reward"
            rows={[
              ['Wager',           monthly.wager_requirement ?? 'No conditions', false],
              ['Max.Bonus',       monthly.max_amount ? fmt(monthly.max_amount) : 'No Limit', false],
              ['Expiration Time', monthly.status === 'claimed' ? '—' : is4() ? 'Available Today!' : mExp, true],
            ]}
            img={bonusimg3}
            canClaim={monthly.canClaim}
            claimed={monthly.status === 'claimed'}
            loading={loading}
            onClaim={() => claimB(monthly._id, 'Monthly')}
          />
        )}

        {/* ── AVAILABLE CASH BONUSES ── */}
        {availC.map(b => {
          const tag = b.bonusType
            ? b.bonusType.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) + ' Bonus'
            : 'Special Bonus';
          return (
            <BonusCard
              key={b._id}
              tag={tag}
              title={b.title}
              desc={b.description}
              rows={[
                ['Wager',     b.wager_requirement ?? 0,                   false],
                ['Max.Bonus', b.amount ? fmt(b.amount) : 'No Limit',      false],
                ...(!b.noExpiry && b.expiresAt ? [['Expiration Time', fmtD(b.expiresAt), true]] : []),
              ]}
              img={imgFor(b.bonusType)}
              canClaim
              claimed={false}
              loading={loading}
              onClaim={() => claimC(b._id)}
            />
          );
        })}

        {/* ── DEPOSIT BONUSES SECTION ── */}
        {depositBonusLoading ? (
          <div className="flex items-center justify-center py-6">
            <div
              className="w-8 h-8 rounded-full border-4 border-slate-200"
              style={{ borderTopColor: '#0bbcd4', animation: 'spin .8s linear infinite' }}
            />
          </div>
        ) : depositBonuses.length > 0 && (
          <>
            <p className="text-xl font-bold text-slate-900 tracking-tight mt-2 mb-4">
           { t.depositBonuses || 'Deposit Bonuses'}
            </p>
            {depositBonuses.map((b, idx) => {
              const tag = b.bonusType
                ? b.bonusType.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) + ' Bonus'
                : 'Deposit Bonus';
              const bonusImgs = [bonusimg1, bonusimg2, bonusimg3, bonusimg4];
              const img = bonusImgs[idx % bonusImgs.length];
              const rows = [
                ...(b.percentage > 0 ? [['Bonus %', `${b.percentage}%`, false]] : []),
                ...(b.maxBonus   > 0 ? [['Max.Bonus', fmt(b.maxBonus),  false]] : []),
                ...(b.amount     > 0 ? [['Amount',    fmt(b.amount),    false]] : []),
                ...(b.minDeposit > 0 ? [['Min.Deposit', fmt(b.minDeposit), false]] : []),
                ...(b.wageringRequirement > 0 ? [['Wager', b.wageringRequirement, false]] : []),
              ];
              return (
                <BonusCard
                  key={b._id || b.id || idx}
                  tag={tag}
                  title={b.name || b.title || 'Deposit Bonus'}
                  desc={b.description}
                  rows={rows}
                  img={img}
                  canClaim
                  claimed={false}
                  loading={false}
                  onClaim={() => navigate('/deposit')}
                />
              );
            })}
          </>
        )}

        {/* ── EMPTY STATE ── */}
        {!weekly && !monthly && cash.length === 0 && depositBonuses.length === 0 && !error && (
          <div className="mt-12 bg-white rounded-3xl border border-slate-100 py-12 px-6 flex flex-col items-center text-center">
            <GiTrophy className="text-5xl text-slate-300 mb-4" />
            <p className="font-bold text-slate-600 text-base mb-1">No Bonuses Available</p>
            <p className="text-slate-400 text-sm leading-relaxed">
              Place bets to earn weekly & monthly bonuses.<br />
              Check back Tuesday & 4th of each month.
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: none; } }
        @keyframes spin   { to   { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default BonusCollection;