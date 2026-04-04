import { useState, useEffect, useCallback, useRef } from 'react';
import { CloudRain, Thermometer, Droplets, Wind, Sun, MapPin, AlertTriangle, ShieldCheck, Send, MessageCircle, Phone, RefreshCw, Umbrella, Eye, CloudSun, ArrowDown, Volume2, Sunrise, Sunset, CloudLightning, Snowflake, Gauge, Bell, Settings, CheckCircle2 } from 'lucide-react';
import { getWeatherByCoords } from '../services/weatherApi';
import useLocation from '../hooks/useLocation';
import Loading from '../components/Loading';
import SpeakButton from '../components/SpeakButton';
import { autoWeatherAlert, showBrowserNotification, getFarmerPhone, setFarmerPhone, sendSMSAlert } from '../services/alertService';

/* ── Weather Backgrounds ── */
function getWeatherBg(desc) {
  const d = (desc || '').toLowerCase();
  if (d.includes('rain') || d.includes('drizzle')) return 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=1200&h=500&fit=crop';
  if (d.includes('cloud')) return 'https://images.unsplash.com/photo-1501630834273-4b5604c98e5e?w=1200&h=500&fit=crop';
  if (d.includes('thunder') || d.includes('storm')) return 'https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?w=1200&h=500&fit=crop';
  if (d.includes('snow') || d.includes('mist') || d.includes('fog')) return 'https://images.unsplash.com/photo-1491002052546-bf38f186af56?w=1200&h=500&fit=crop';
  return 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&h=500&fit=crop';
}

/* ── Smart Decision Engine ── */
function analyzeWeather(current, forecast) {
  const alerts = [];
  const actions = [];
  let dangerLevel = 'safe'; // safe, warning, danger

  const temp = current?.temp || 30;
  const humidity = current?.humidity || 50;
  const wind = parseFloat(current?.wind) || 0;
  const desc = (current?.description || '').toLowerCase();

  // ── Rain Detection ──
  const isRaining = desc.includes('rain') || desc.includes('drizzle') || desc.includes('shower');
  const willRain = forecast?.some(f => {
    const d = (f.description || '').toLowerCase();
    return d.includes('rain') || d.includes('drizzle') || d.includes('shower') || d.includes('thunder');
  });
  const rainProbability = isRaining ? 90 : willRain ? 70 : humidity > 85 ? 55 : 20;

  if (rainProbability > 50) {
    dangerLevel = rainProbability > 75 ? 'danger' : 'warning';
    alerts.push({
      type: 'rain',
      icon: '🌧️',
      severity: rainProbability > 75 ? 'danger' : 'warning',
      titleHi: '⚠️ Barish aane wali hai!',
      titleEn: '⚠️ Rain Alert — Rain Expected!',
      probability: `${rainProbability}%`,
      actions: [
        { hi: '👉 Fasal ko cover karo', en: '👉 Cover your crops immediately' },
        { hi: '👉 Bahar rakhi fasal andar le jao', en: '👉 Move harvested produce indoors' },
        { hi: '👉 Low-lying fields se paani nikalo', en: '👉 Ensure drainage in low-lying fields' },
        { hi: '👉 Spray mat karo — paani dho dega', en: '👉 Do not spray pesticides — rain will wash them away' },
      ],
      whatsappMsg: `⚠️ WEATHER ALERT — RAIN EXPECTED\n☔ Rain probability: ${rainProbability}%\n\n👉 Cover your crops\n👉 Move produce indoors\n👉 Ensure field drainage\n👉 Don't spray today\n\n— AgriSaar Smart Farming`,
    });
  }

  // ── Heat Detection ──
  if (temp > 35) {
    dangerLevel = temp > 42 ? 'danger' : 'warning';
    alerts.push({
      type: 'heat',
      icon: '☀️',
      severity: temp > 42 ? 'danger' : 'warning',
      titleHi: `⚠️ Bahut garmi hai! (${temp}°C)`,
      titleEn: `⚠️ Extreme Heat Alert — ${temp}°C!`,
      probability: `${temp}°C`,
      actions: [
        { hi: '👉 Fasal ko paani do — subah/shaam', en: '👉 Irrigate crops — morning or evening only' },
        { hi: '👉 Dopahar mein spray mat karo', en: '👉 Do NOT spray in afternoon — chemical burn risk' },
        { hi: '👉 Mulching karo — mitti ki nami bachao', en: '👉 Apply mulch to retain soil moisture' },
        { hi: '👉 Baahar kaam mat karo 12-3 baje', en: '👉 Avoid outdoor farm work between 12-3 PM' },
      ],
      whatsappMsg: `⚠️ HEAT ALERT — ${temp}°C\n🌡️ Extreme heat detected!\n\n👉 Irrigate morning/evening\n👉 Don't spray in afternoon\n👉 Apply mulch to soil\n👉 Rest between 12-3 PM\n\n— AgriSaar Smart Farming`,
    });
  }

  // ── Cold Detection ──
  if (temp < 8) {
    dangerLevel = temp < 3 ? 'danger' : 'warning';
    alerts.push({
      type: 'cold',
      icon: '❄️',
      severity: temp < 3 ? 'danger' : 'warning',
      titleHi: `⚠️ Bahut thand hai! (${temp}°C)`,
      titleEn: `⚠️ Frost Alert — ${temp}°C!`,
      probability: `${temp}°C`,
      actions: [
        { hi: '👉 Seedlings ko plastic se dhako', en: '👉 Cover seedlings with plastic sheets' },
        { hi: '👉 Halki sinchai karo — frost se bachao', en: '👉 Light irrigation prevents frost damage' },
        { hi: '👉 Dhuaan karo khet mein — temperature badhao', en: '👉 Create smoke in fields to raise temperature' },
      ],
      whatsappMsg: `⚠️ COLD/FROST ALERT — ${temp}°C\n❄️ Risk of crop damage!\n\n👉 Cover seedlings with plastic\n👉 Light irrigation helps\n👉 Create smoke in fields\n\n— AgriSaar Smart Farming`,
    });
  }

  // ── Strong Wind Detection ──
  if (wind > 40) {
    dangerLevel = 'warning';
    alerts.push({
      type: 'wind',
      icon: '💨',
      severity: 'warning',
      titleHi: `⚠️ Tez hawa chal rahi hai! (${wind} km/h)`,
      titleEn: `⚠️ Strong Wind Alert — ${wind} km/h!`,
      probability: `${wind} km/h`,
      actions: [
        { hi: '👉 Lambi faslon ko support do', en: '👉 Stake tall crops to prevent lodging' },
        { hi: '👉 Spray mat karo — hawa mein udh jaega', en: '👉 Do NOT spray — chemicals will drift' },
      ],
      whatsappMsg: `⚠️ WIND ALERT — ${wind} km/h\n💨 Strong winds!\n\n👉 Stake tall crops\n👉 Don't spray today\n\n— AgriSaar Smart Farming`,
    });
  }

  // ── If Everything is Fine ──
  if (alerts.length === 0) {
    dangerLevel = 'safe';
    actions.push(
      { hi: '✅ Mausam bilkul sahi hai — normal kaam karo', en: '✅ Weather is perfect — continue normal farming' },
      { hi: '✅ Spray aur irrigation ka sahi waqt hai', en: '✅ Good time for spraying and irrigation' },
      { hi: '✅ Fasal ki dekhbhal jaari rakho', en: '✅ Continue regular crop monitoring' },
    );
  }

  // ── Tomorrow's Smart Decision ──
  let tomorrowDecision = null;
  if (forecast?.length > 0) {
    const tmr = forecast[0];
    const tmrDesc = (tmr?.description || '').toLowerCase();
    const tmrRain = tmrDesc.includes('rain') || tmrDesc.includes('shower') || tmrDesc.includes('thunder');
    const tmrHot = (tmr?.tempMax || 0) > 38;
    
    if (tmrRain) {
      tomorrowDecision = {
        icon: '🌧️',
        hi: `Kal barish hai → fasal ko nuksaan ho sakta hai\n👉 Aaj hi fasal secure karo!`,
        en: `Rain expected tomorrow → crop damage possible\n👉 Secure your crop TODAY!`,
        color: 'from-blue-600 to-indigo-700',
      };
    } else if (tmrHot) {
      tomorrowDecision = {
        icon: '🔥',
        hi: `Kal bahut garmi hogi (${tmr.tempMax}°C)\n👉 Aaj raat paani de do!`,
        en: `Extreme heat tomorrow (${tmr.tempMax}°C)\n👉 Irrigate tonight!`,
        color: 'from-orange-600 to-red-700',
      };
    }
  }

  return { alerts, actions, dangerLevel, rainProbability, tomorrowDecision };
}

/* ── Share Functions ── */
function shareOnWhatsApp(message) {
  const encoded = encodeURIComponent(message);
  window.open(`https://wa.me/?text=${encoded}`, '_blank');
}

function shareViaSMS(message) {
  window.open(`sms:?body=${encodeURIComponent(message)}`, '_blank');
}

export default function WeatherPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [alertsSent, setAlertsSent] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState(() => getFarmerPhone());
  const [showPhoneSettings, setShowPhoneSettings] = useState(false);
  const [notifPermission, setNotifPermission] = useState(typeof Notification !== 'undefined' ? Notification.permission : 'default');
  const alertTriggered = useRef(false);
  const { lat, lon, city, state, locationText, loading: locLoading } = useLocation();

  // Auto-trigger alerts when weather data loads
  useEffect(() => {
    if (data && !alertTriggered.current) {
      alertTriggered.current = true;
      const run = async () => {
        const alerts = await autoWeatherAlert(data.current, city, data.forecast);
        setAlertsSent(alerts);
      };
      run();
    }
  }, [data, city]);

  const enableNotifications = async () => {
    if ('Notification' in window) {
      const perm = await Notification.requestPermission();
      setNotifPermission(perm);
      if (perm === 'granted') {
        await showBrowserNotification('🌾 AgriSaar Alerts Enabled!', `You'll receive weather alerts for ${city || 'your area'} automatically.`);
      }
    }
  };

  const savePhone = () => {
    setFarmerPhone(phoneNumber);
    setShowPhoneSettings(false);
  };

  const sendManualAlert = async () => {
    const current = data?.current;
    const msg = `🌾 AgriSaar Weather — ${city || 'Your Area'}\n🌡️ ${current?.temp}°C | 💧 ${current?.humidity}% | 💨 ${current?.wind} km/h\n☁️ ${current?.description}\n\n${alertsSent.length > 0 ? '⚠️ ' + alertsSent[0].title : '✅ All clear for farming!'}\n\n— AgriSaar Smart Farming`;
    await sendSMSAlert(msg, phoneNumber);
  };

  useEffect(() => {
    if (!locLoading && lat && lon) loadWeather();
  }, [locLoading, lat, lon]);

  const loadWeather = async () => {
    try {
      setLoading(true);
      let weatherResult = null;

      // Direct OpenWeatherMap (no backend needed)
      try {
        const [currentRes, forecastRes] = await Promise.all([
          fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=d0be759f268a1e54e4dc78e5eeaea0dd&units=metric`).then(r => r.json()),
          fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=d0be759f268a1e54e4dc78e5eeaea0dd&units=metric`).then(r => r.json()),
        ]);

        if (currentRes?.main) {
          const current = {
            temp: Math.round(currentRes.main.temp),
            feelsLike: Math.round(currentRes.main.feels_like),
            humidity: currentRes.main.humidity,
            wind: (currentRes.wind?.speed * 3.6).toFixed(1),
            pressure: currentRes.main.pressure,
            visibility: currentRes.visibility ? (currentRes.visibility / 1000).toFixed(1) : '10',
            description: currentRes.weather?.[0]?.description || 'Clear',
            icon: currentRes.weather?.[0]?.icon ? `https://openweathermap.org/img/wn/${currentRes.weather[0].icon}@4x.png` : null,
            sunrise: currentRes.sys?.sunrise ? new Date(currentRes.sys.sunrise * 1000).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : null,
            sunset: currentRes.sys?.sunset ? new Date(currentRes.sys.sunset * 1000).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : null,
          };

          const forecast = [];
          const seen = new Set();
          (forecastRes?.list || []).forEach(item => {
            const date = item.dt_txt?.split(' ')[0];
            if (date && !seen.has(date) && forecast.length < 5) {
              seen.add(date);
              const d = new Date(date);
              forecast.push({
                date,
                dayName: d.toLocaleDateString('en-IN', { weekday: 'short' }),
                fullDay: d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' }),
                tempMax: Math.round(item.main.temp_max),
                tempMin: Math.round(item.main.temp_min),
                humidity: item.main.humidity,
                wind: (item.wind?.speed * 3.6).toFixed(0),
                description: item.weather?.[0]?.description || '',
                icon: item.weather?.[0]?.icon ? `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png` : null,
              });
            }
          });

          weatherResult = { current, forecast };
        }
      } catch (e) {
        console.warn('OWM failed:', e);
      }

      // Backend fallback
      if (!weatherResult) {
        try {
          const res = await getWeatherByCoords(lat, lon, locationText);
          weatherResult = res.data || res;
        } catch { /* ignore */ }
      }

      // Ultimate fallback
      if (!weatherResult) {
        weatherResult = {
          current: { temp: 32, feelsLike: 34, humidity: 65, wind: '12', pressure: 1013, visibility: '10', description: 'Partly cloudy', icon: 'https://openweathermap.org/img/wn/02d@4x.png' },
          forecast: [],
        };
      }

      setData(weatherResult);
    } catch {
      setData({
        current: { temp: 30, feelsLike: 32, humidity: 60, wind: '10', pressure: 1012, visibility: '8', description: 'Clear', icon: 'https://openweathermap.org/img/wn/01d@4x.png' },
        forecast: [],
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadWeather();
    setRefreshing(false);
  };

  if (locLoading || loading) return <Loading text="Detecting location & analyzing weather conditions..." />;
  if (!data) return null;

  const current = data.current;
  const forecast = data.forecast || [];
  const analysis = analyzeWeather(current, forecast);
  const bgImage = getWeatherBg(current?.description);

  const overallSpeakText = `Weather for ${city || 'your area'}. Temperature: ${current?.temp} degrees. Humidity: ${current?.humidity} percent. Wind: ${current?.wind} km per hour. ${current?.description}. ${analysis.alerts.map(a => a.titleEn + '. ' + a.actions.map(ac => ac.en).join('. ')).join('. ') || 'Weather is safe for farming.'}`;

  return (
    <div className="min-h-screen bg-[#f8faf8] pb-12">
      {/* ── Hero Section with Live Weather ── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={bgImage} alt="Weather" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 via-gray-900/50 to-[#f8faf8]"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pt-16">
          {/* Location & Refresh */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md px-4 py-2 rounded-full border border-white/15">
              <MapPin className="w-4 h-4 text-green-400" />
              <span className="text-white font-bold text-sm">{city || 'Your Area'}, {state || 'India'}</span>
            </div>
            <div className="flex items-center gap-2">
              <SpeakButton text={overallSpeakText} label="" size="sm" />
              <button onClick={handleRefresh} disabled={refreshing} className="flex items-center gap-2 bg-white/15 backdrop-blur-md text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-white/25 transition-all border border-white/15 disabled:opacity-50">
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} /> Refresh
              </button>
            </div>
          </div>

          {/* Main Weather Display */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
            <div className="flex items-center gap-4">
              {current?.icon && <img src={current.icon} alt="" className="w-28 h-28 drop-shadow-2xl" />}
              <div>
                <p className="text-7xl font-black text-white drop-shadow-xl">{current?.temp}°<span className="text-4xl text-white/70">C</span></p>
                <p className="text-white/80 text-lg font-bold capitalize mt-1">{current?.description}</p>
                <p className="text-white/50 text-sm font-medium">Feels like {current?.feelsLike}°C</p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 flex-1">
              <StatsCard icon={<Droplets className="w-5 h-5 text-cyan-300" />} label="Humidity" value={`${current?.humidity}%`} />
              <StatsCard icon={<Wind className="w-5 h-5 text-emerald-300" />} label="Wind" value={`${current?.wind} km/h`} />
              <StatsCard icon={<Eye className="w-5 h-5 text-blue-300" />} label="Visibility" value={`${current?.visibility} km`} />
              <StatsCard icon={<Gauge className="w-5 h-5 text-purple-300" />} label="Pressure" value={`${current?.pressure} hPa`} />
            </div>
          </div>

          {/* Sunrise / Sunset */}
          {(current?.sunrise || current?.sunset) && (
            <div className="flex gap-4 mt-6">
              {current.sunrise && (
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
                  <Sunrise className="w-4 h-4 text-amber-300" />
                  <span className="text-white/80 text-sm font-bold">Sunrise: {current.sunrise}</span>
                </div>
              )}
              {current.sunset && (
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
                  <Sunset className="w-4 h-4 text-orange-300" />
                  <span className="text-white/80 text-sm font-bold">Sunset: {current.sunset}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4">

        {/* ═══════════ ALERT BOXES — The Core Feature ═══════════ */}
        {analysis.alerts.length > 0 && (
          <div className="space-y-4 mb-8">
            {analysis.alerts.map((alert, i) => (
              <div key={i} className={`rounded-[2rem] overflow-hidden shadow-lg border-2 ${
                alert.severity === 'danger' ? 'border-red-300 bg-gradient-to-r from-red-50 to-red-100' : 'border-amber-300 bg-gradient-to-r from-amber-50 to-yellow-50'
              }`}>
                {/* Alert Header */}
                <div className={`px-6 py-4 flex items-center justify-between ${
                  alert.severity === 'danger' ? 'bg-red-600' : 'bg-amber-500'
                }`}>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{alert.icon}</span>
                    <div>
                      <h3 className="text-xl font-black text-white">{alert.titleEn}</h3>
                      <p className="text-white/80 text-sm font-bold">{alert.titleHi}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="bg-white/20 backdrop-blur-md text-white font-black text-lg px-4 py-1.5 rounded-full">{alert.probability}</span>
                  </div>
                </div>

                {/* Actions — What to Do */}
                <div className="p-6">
                  <h4 className="text-sm font-black text-gray-500 uppercase tracking-widest mb-4">👨‍🌾 What You Must Do NOW</h4>
                  <div className="grid sm:grid-cols-2 gap-3 mb-6">
                    {alert.actions.map((action, j) => (
                      <div key={j} className={`p-4 rounded-xl border ${
                        alert.severity === 'danger' ? 'bg-white border-red-200' : 'bg-white border-amber-200'
                      }`}>
                        <p className="text-base font-bold text-gray-900">{action.en}</p>
                        <p className="text-sm text-gray-500 font-medium mt-0.5">{action.hi}</p>
                      </div>
                    ))}
                  </div>

                  {/* Share Alert — WhatsApp + SMS */}
                  <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => shareOnWhatsApp(alert.whatsappMsg)}
                      className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-black text-sm transition-all shadow-md hover:shadow-lg active:scale-95"
                    >
                      <MessageCircle className="w-5 h-5" /> Share on WhatsApp
                    </button>
                    <button
                      onClick={() => shareViaSMS(alert.whatsappMsg)}
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-black text-sm transition-all shadow-md hover:shadow-lg active:scale-95"
                    >
                      <Phone className="w-5 h-5" /> Send SMS Alert
                    </button>
                    <button
                      onClick={() => {
                        if ('speechSynthesis' in window) {
                          window.speechSynthesis.cancel();
                          const u = new SpeechSynthesisUtterance(alert.titleEn + '. ' + alert.actions.map(a => a.en).join('. '));
                          u.lang = 'en-IN'; u.rate = 0.9;
                          window.speechSynthesis.speak(u);
                        }
                      }}
                      className="flex items-center gap-2 bg-gray-800 hover:bg-gray-900 text-white px-6 py-3 rounded-xl font-black text-sm transition-all shadow-md active:scale-95"
                    >
                      <Volume2 className="w-5 h-5" /> Listen Alert
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ═══════════ SAFE Box — All Clear ═══════════ */}
        {analysis.dangerLevel === 'safe' && (
          <div className="rounded-[2rem] bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 p-6 mb-8 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-green-500 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/25">
                <ShieldCheck className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-green-900">🟢 All Clear — Safe for Farming!</h3>
                <p className="text-green-700 font-bold text-sm">Mausam bilkul sahi hai — kaam jaari rakho!</p>
              </div>
            </div>
            <div className="grid sm:grid-cols-3 gap-3">
              {analysis.actions.map((action, i) => (
                <div key={i} className="bg-white rounded-xl p-4 border border-green-200">
                  <p className="text-sm font-bold text-gray-900">{action.en}</p>
                  <p className="text-xs text-gray-500 font-medium mt-1">{action.hi}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══════════ Tomorrow's Smart Decision ═══════════ */}
        {analysis.tomorrowDecision && (
          <div className={`rounded-[2rem] bg-gradient-to-r ${analysis.tomorrowDecision.color} p-6 mb-8 shadow-xl text-white relative overflow-hidden`}>
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="relative z-10">
              <div className="flex items-start gap-4">
                <span className="text-5xl">{analysis.tomorrowDecision.icon}</span>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-white/60 mb-2">🤖 Smart Decision Engine</h3>
                  <p className="text-xl font-black whitespace-pre-line">{analysis.tomorrowDecision.en}</p>
                  <p className="text-white/70 font-bold mt-2 whitespace-pre-line">{analysis.tomorrowDecision.hi}</p>
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <button onClick={() => shareOnWhatsApp(analysis.tomorrowDecision.en)} className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" /> Share Decision
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════ 5-Day Forecast ═══════════ */}
        {forecast.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2">
              <CloudSun className="w-6 h-6 text-blue-600" /> 5-Day Forecast
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {forecast.map((day, i) => {
                const dayDesc = (day.description || '').toLowerCase();
                const hasRain = dayDesc.includes('rain') || dayDesc.includes('shower');
                const isHot = day.tempMax > 38;
                
                return (
                  <div key={i} className={`bg-white rounded-[1.5rem] p-5 border shadow-sm hover:shadow-md transition-all text-center group ${
                    hasRain ? 'border-blue-200 bg-blue-50/30' : isHot ? 'border-orange-200 bg-orange-50/30' : 'border-gray-100'
                  }`}>
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">{day.dayName}</p>
                    <p className="text-[10px] text-gray-500 font-bold mb-3">{day.fullDay}</p>
                    {day.icon && <img src={day.icon} alt="" className="w-14 h-14 mx-auto mb-2 group-hover:scale-110 transition-transform" />}
                    <p className="text-2xl font-black text-gray-900">{day.tempMax}°</p>
                    <p className="text-sm text-gray-400 font-bold">{day.tempMin}°</p>
                    <p className="text-[11px] text-gray-500 font-medium mt-2 capitalize">{day.description}</p>
                    
                    {/* Alert indicator */}
                    {hasRain && <span className="inline-block mt-2 text-[10px] font-black text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">🌧️ Rain</span>}
                    {isHot && <span className="inline-block mt-2 text-[10px] font-black text-orange-700 bg-orange-100 px-2 py-0.5 rounded-full">🔥 Hot</span>}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ═══════════ Quick Actions Bar ═══════════ */}
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6">
          <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
            <Send className="w-5 h-5 text-primary-600" /> Quick Share Weather Alert
          </h3>
          <p className="text-xs text-gray-500 font-medium mb-4">Send weather updates to your family or farming group:</p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => shareOnWhatsApp(
                `🌾 AgriSaar Weather Update\n📍 ${city || 'Your Area'}, ${state || ''}\n🌡️ Temperature: ${current?.temp}°C\n💧 Humidity: ${current?.humidity}%\n💨 Wind: ${current?.wind} km/h\n☁️ ${current?.description}\n\n${analysis.alerts.length > 0 ? '⚠️ ALERT: ' + analysis.alerts[0].titleEn : '✅ All clear — safe for farming!'}\n\n— AgriSaar Smart Farming AI`
              )}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-md"
            >
              <MessageCircle className="w-5 h-5" /> Share on WhatsApp
            </button>
            <button
              onClick={() => shareViaSMS(
                `AgriSaar: ${city || 'Your Area'} — ${current?.temp}°C, ${current?.description}. ${analysis.alerts.length > 0 ? 'ALERT: ' + analysis.alerts[0].titleEn : 'All clear for farming.'}`
              )}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-md"
            >
              <Phone className="w-5 h-5" /> Send SMS
            </button>
          </div>
        </div>

        {/* ═══════════ Phone Number & Notification Settings ═══════════ */}
        <div className="mt-8 bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
              <Bell className="w-5 h-5 text-amber-500" /> Auto Alert Settings
            </h3>
            <button onClick={() => setShowPhoneSettings(!showPhoneSettings)} className="text-sm font-bold text-primary-600 hover:text-primary-800 flex items-center gap-1">
              <Settings className="w-4 h-4" /> {showPhoneSettings ? 'Close' : 'Configure'}
            </button>
          </div>

          {/* Alert Status */}
          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            <div className={`p-4 rounded-xl border ${notifPermission === 'granted' ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
              <div className="flex items-center gap-2 mb-1">
                {notifPermission === 'granted' ? <CheckCircle2 className="w-5 h-5 text-green-600" /> : <Bell className="w-5 h-5 text-amber-600" />}
                <span className={`text-sm font-black ${notifPermission === 'granted' ? 'text-green-800' : 'text-amber-800'}`}>Browser Alerts</span>
              </div>
              {notifPermission !== 'granted' ? (
                <button onClick={enableNotifications} className="text-xs font-bold text-amber-700 underline mt-1">Click to Enable</button>
              ) : (
                <p className="text-xs text-green-600 font-medium">Active — You'll get alerts automatically</p>
              )}
            </div>

            <div className="p-4 rounded-xl bg-green-50 border border-green-200">
              <div className="flex items-center gap-2 mb-1">
                <Phone className="w-5 h-5 text-green-600" />
                <span className="text-sm font-black text-green-800">SMS Alerts</span>
              </div>
              <p className="text-xs text-green-600 font-bold">📱 {phoneNumber}</p>
            </div>

            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
              <div className="flex items-center gap-2 mb-1">
                <MessageCircle className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-black text-blue-800">WhatsApp</span>
              </div>
              <p className="text-xs text-blue-600 font-bold">One-tap share enabled</p>
            </div>
          </div>

          {/* Phone Settings Panel */}
          {showPhoneSettings && (
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 mb-4">
              <label className="text-xs font-black text-gray-500 uppercase tracking-wider block mb-2">Your Phone Number (for SMS alerts)</label>
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">+91</span>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="Enter 10-digit mobile number"
                    className="w-full border border-gray-200 rounded-xl py-3 pl-14 pr-4 font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                    maxLength={10}
                  />
                </div>
                <button onClick={savePhone} className="bg-green-600 hover:bg-green-700 text-white px-6 rounded-xl font-bold text-sm transition-all shadow-md">Save</button>
              </div>
            </div>
          )}

          {/* Manual Alert Trigger */}
          <div className="flex flex-wrap gap-3">
            <button onClick={sendManualAlert} className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-black text-sm shadow-md transition-all active:scale-95">
              <Send className="w-5 h-5" /> Send Alert to My Phone ({phoneNumber})
            </button>
            <button onClick={enableNotifications} className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-bold text-sm transition-all border border-gray-200">
              <Bell className="w-5 h-5" /> {notifPermission === 'granted' ? '✅ Browser Notifications ON' : 'Enable Push Notifications'}
            </button>
          </div>

          <p className="text-[10px] text-gray-400 font-medium mt-4">
            ⚡ Auto-alerts fire once daily when dangerous weather is detected. Configure your number above to receive SMS alerts directly on your phone.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Stats Mini Card ── */
function StatsCard({ icon, label, value }) {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10 flex items-center gap-3">
      {icon}
      <div>
        <p className="text-white/50 text-[10px] font-bold uppercase tracking-wider">{label}</p>
        <p className="text-white font-extrabold text-lg">{value}</p>
      </div>
    </div>
  );
}
