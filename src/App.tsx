import React, { useEffect, useMemo, useRef, useState } from 'react';

interface DressModel {
  img: string;
  alt: string;
  label: string;
}

interface BonusItem {
  tag: string;
  img: string;
  title: string;
  description: string;
  was: string;
}

interface FaqItem {
  question: string;
  answer: string;
  featured?: boolean;
}

const MODELS_ROW_A: DressModel[] = [
  {
    img: '/media/modelo-1.webp',
    alt: 'Vestido Evangélico Godê Longo e o molde com medidas',
    label: 'Evangélico Godê Longo',
  },
  {
    img: '/media/modelo-2.webp',
    alt: 'Vestido Três Marias Floral e o molde com medidas',
    label: 'Três Marias Floral',
  },
  {
    img: '/media/modelo-3.webp',
    alt: 'Vestido Chemise de Botões e o molde com medidas',
    label: 'Chemise de Botões',
  },
  {
    img: '/media/modelo-4.webp',
    alt: 'Vestido Evasê Midi com Manga e o molde com medidas',
    label: 'Evasê Midi com Manga',
  },
  {
    img: '/media/modelo-5.webp',
    alt: 'Vestido Tubinho Manga Longa e o molde com medidas',
    label: 'Tubinho Manga Longa',
  },
  {
    img: '/media/modelo-6.webp',
    alt: 'Vestido Plus Size Evasê e o molde com medidas',
    label: 'Plus Size Evasê',
  },
];

const MODELS_ROW_B: DressModel[] = [
  ...MODELS_ROW_A.slice(3),
  ...MODELS_ROW_A.slice(0, 3),
];

const BONUSES: BonusItem[] = [
  {
    tag: 'Bônus 1',
    img: '/media/bonus1-custom.webp',
    title: 'Tabela de Medidas do PP ao Plus Size',
    description:
      'Busto, cintura e quadril de cada tamanho e a ficha para anotar as medidas da cliente.',
    was: 'R$\u00A067,00',
  },
  {
    tag: 'Bônus 2',
    img: '/media/bonus2-custom.webp',
    title: 'Guia de Tecidos',
    description:
      'Qual tecido fica lindo em cada modelo e quantos metros comprar, sem sobrar nem faltar.',
    was: 'R$\u00A047,00',
  },
  {
    tag: 'Bônus 3',
    img: '/media/bonus3-custom.webp',
    title: 'Molde A4 Sem Erro',
    description:
      'Como imprimir na escala certa, juntar as folhas e passar o molde para o tecido.',
    was: 'R$\u00A057,00',
  },
  {
    tag: 'Bônus 4',
    img: '/media/bonus4-custom.webp',
    title: 'Quanto Cobrar',
    description:
      'A conta certinha do preço do vestido e mensagens prontas para vender no WhatsApp.',
    was: 'R$\u00A077,00',
  },
];

const DEPOIMENTOS = [
  {
    src: '/media/dep-1.webp',
    alt: 'Depoimento de cliente no WhatsApp mostrando vestido feito com os moldes',
  },
  {
    src: '/media/dep-2.webp',
    alt: 'Depoimento de cliente no WhatsApp elogiando o caimento dos moldes',
  },
  {
    src: '/media/dep-3.webp',
    alt: 'Depoimento de cliente no WhatsApp sobre os moldes de vestidos',
  },
  {
    src: '/media/dep-4.webp',
    alt: 'Depoimento de cliente no WhatsApp elogiando os moldes e os vestidos feitos',
  },
];

const FAQS: FaqItem[] = [
  {
    question: 'Preciso ter impressora?',
    answer:
      'Não precisa, querida! Se não tiver impressora em casa, é só levar o arquivo na papelaria e pedir pra imprimir em folha A4, tamanho real. No “Comece aqui” a Ana mostra direitinho como juntar as folhas.',
  },
  {
    question: 'Quais tamanhos vêm?',
    answer:
      'Cada molde vem com a sua grade de tamanhos, do PP ao plus size conforme o modelo. Junto vem a tabela de medidas pra você escolher o tamanho certo de cada cliente.',
  },
  {
    question: 'Sou iniciante, vou conseguir?',
    answer:
      'Vai sim! 💗 O molde já vem pronto com as medidas, então você não precisa desenhar nada. É escolher o tamanho, cortar e costurar. E no Completo você ainda ganha o guia Molde A4 Sem Erro.',
  },
  {
    question: 'Qual a diferença entre o Básico e o Completo?',
    answer:
      'O Básico (R$\u00A010,90) traz 20 moldes de vestidos. O Completo (R$\u00A029,90) traz mais de 50 moldes, incluindo plus size, e os 4 bônus: Tabela de Medidas, Guia de Tecidos, Molde A4 Sem Erro e Quanto Cobrar.',
  },
  {
    question: 'Posso vender os vestidos que eu costurar?',
    answer:
      'Pode e deve! Os vestidos que você fizer podem ser vendidos à vontade. Só não é permitido revender ou repassar os arquivos dos moldes.',
  },
  {
    question: 'E se eu não gostar?',
    answer:
      'Sem problema nenhum! Você tem 21 dias pra usar os moldes e, se não for o que esperava, é só pedir que devolvemos 100% do valor. E o acesso é vitalício 💗',
  },
];

const MONTHS_PT = [
  'janeiro',
  'fevereiro',
  'março',
  'abril',
  'maio',
  'junho',
  'julho',
  'agosto',
  'setembro',
  'outubro',
  'novembro',
  'dezembro',
];

function appendCurrentSearch(baseUrl: string): string {
  if (typeof window === 'undefined' || !window.location.search) {
    return baseUrl;
  }
  try {
    const url = new URL(baseUrl);
    new URLSearchParams(window.location.search).forEach((value, key) => {
      if (!url.searchParams.has(key)) {
        url.searchParams.set(key, value);
      }
    });
    return url.toString();
  } catch {
    return baseUrl;
  }
}

export default function App() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressBarRef = useRef<HTMLElement>(null);
  const [countdownSeconds, setCountdownSeconds] = useState(15 * 60);
  const [modalOpen, setModalOpen] = useState(false);
  const [videoActivated, setVideoActivated] = useState(false);
  const [videoPaused, setVideoPaused] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const [videoMuted, setVideoMuted] = useState(true);

  const { todayFormatted, tomorrowFormatted } = useMemo(() => {
    const now = new Date();
    const dd = String(now.getDate()).padStart(2, '0');
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const yyyy = now.getFullYear();

    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return {
      todayFormatted: `${dd}/${mm}/${yyyy}`,
      tomorrowFormatted: `${tomorrow.getDate()} de ${MONTHS_PT[tomorrow.getMonth()]}`,
    };
  }, []);

  const checkoutUrls = useMemo(
    () => ({
      basico: appendCurrentSearch('https://appdigitalhub.com.br/c/0C745A9A'),
      completo: appendCurrentSearch('https://appdigitalhub.com.br/c/1AD6365B'),
      upsell: appendCurrentSearch('https://appdigitalhub.com.br/c/32319B3B'),
    }),
    []
  );

  useEffect(() => {
    if (!modalOpen) return;
    const endTime = Date.now() + 15 * 60 * 1000;
    setCountdownSeconds(15 * 60);

    const interval = window.setInterval(() => {
      const remaining = Math.max(0, Math.round((endTime - Date.now()) / 1000));
      setCountdownSeconds(remaining);
    }, 1000);

    return () => window.clearInterval(interval);
  }, [modalOpen]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          if (!v.paused) {
            v.pause();
          }
        } else if (!videoPaused && !videoEnded) {
          void v.play().catch(() => {});
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(v);
    return () => observer.disconnect();
  }, [videoPaused, videoEnded]);

  const openUpsellModal = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const dlg = dialogRef.current;
    if (dlg && typeof dlg.showModal === 'function') {
      e.preventDefault();
      setModalOpen(true);
      if (!dlg.open) {
        dlg.showModal();
      }
    }
  };

  const closeUpsellModal = () => {
    const dlg = dialogRef.current;
    if (dlg && dlg.open) {
      dlg.close();
    }
    setModalOpen(false);
  };

  const handleVideoClick = () => {
    const v = videoRef.current;
    if (!v) return;

    if (!videoActivated) {
      v.currentTime = 0;
      v.muted = false;
      v.loop = false;
      if (progressBarRef.current) {
        progressBarRef.current.style.transform = 'scaleX(0)';
      }
      setVideoActivated(true);
      setVideoMuted(false);
      setVideoEnded(false);
      setVideoPaused(false);
      void v.play();
      return;
    }

    if (videoEnded) {
      v.currentTime = 0;
      v.muted = false;
      if (progressBarRef.current) {
        progressBarRef.current.style.transform = 'scaleX(0)';
      }
      setVideoMuted(false);
      setVideoEnded(false);
      setVideoPaused(false);
      void v.play();
      return;
    }

    if (v.paused) {
      setVideoPaused(false);
      void v.play();
    } else {
      v.pause();
      setVideoPaused(true);
    }
  };

  const handleToggleMute = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setVideoMuted(v.muted);
  };

  const formattedTimer = `${String(Math.floor(countdownSeconds / 60)).padStart(2, '0')}:${String(
    countdownSeconds % 60
  ).padStart(2, '0')}`;

  return (
    <>
      <svg className="sprite" aria-hidden="true" focusable="false" width="0" height="0">
        <defs>
          <symbol id="ico-check" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm-1.2 14.2-4-4 1.4-1.4 2.6 2.6 5.6-5.6 1.4 1.4-7 7Z"
            />
          </symbol>
          <symbol id="ico-star" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="m12 2.5 2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5-4.8-4.6 6.6-.9z"
            />
          </symbol>
          <symbol id="ico-infinito" viewBox="0 0 24 24">
            <path
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              d="M12 12c-2-2.8-3.5-4-5.2-4a4 4 0 0 0 0 8c1.7 0 3.2-1.2 5.2-4s3.5-4 5.2-4a4 4 0 0 1 0 8c-1.7 0-3.2-1.2-5.2-4Z"
            />
          </symbol>
          <symbol id="ico-gift" viewBox="0 0 36 36">
            <path
              fill="#FDD888"
              d="M33 31c0 2.2-1.8 4-4 4H7c-2.2 0-4-1.8-4-4V14c0-2.2 1.8-4 4-4h22c2.2 0 4 1.8 4 4v17z"
            />
            <path
              fill="#FDD888"
              d="M36 11c0 2.2-1.8 4-4 4H4c-2.2 0-4-1.8-4-4s1.8-4 4-4h28c2.2 0 4 1.8 4 4z"
            />
            <path fill="#FCAB40" d="M3 15h30v2H3z" />
            <path
              fill="#DA2F47"
              d="M19 3h-2c-1.657 0-3 1.343-3 3v29h8V6c0-1.656-1.343-3-3-3z"
            />
            <path
              fill="#DA2F47"
              d="M16 7c1.1 0 1.263-.516.361-1.147L9.639 1.147c-.902-.631-2.085-.366-2.631.589L4.992 5.264C4.446 6.219 4.9 7 6 7h10zm4 0c-1.1 0-1.263-.516-.361-1.147l6.723-4.706c.901-.631 2.085-.366 2.631.589l2.016 3.527C31.554 6.219 31.1 7 30 7H20z"
            />
          </symbol>
        </defs>
      </svg>

      <div className="rank-bar" role="note">
        <svg className="rank-ico tw" aria-hidden="true">
          <use href="#ico-gift" />
        </svg>
        <span>
          A promoção dessa página acaba no dia <b>{todayFormatted}</b>
        </span>
      </div>

      <header
        className="hero"
        id="inicio"
        style={
          {
            '--h-bg':
              'radial-gradient(520px 260px at 12% 8%,#FFFFFF 0,transparent 70%),radial-gradient(520px 300px at 92% 40%,#FCE1EE 0,transparent 70%),linear-gradient(180deg,#FFFFFF,#FCE8F1)',
            '--h-ink': '#4A1F3D',
            '--h-em': '#D61F74',
            '--h-mesmo': '#8B4BB0',
            '--h-moldura': '#F3C6DA',
            '--h-painel': '#FCE8F1',
          } as React.CSSProperties
        }
      >
        <div className="shell">
          <h1>
            Crie Vestidos Evangélicos Tão Lindos Que as Irmãs Vão Perguntar:{' '}
            <em>"Foi Você Que Fez?"</em>
          </h1>
          <p className="hero-mesmo">
            MESMO QUE VOCÊ NUNCA TENHA FEITO UMA MODELAGEM NA VIDA!
          </p>
          <figure className="hero-visual">
            <div className="hero-glow" aria-hidden="true" />
            <div
              className="hero-video-wrap"
              onClick={handleVideoClick}
              role="button"
              tabIndex={0}
              aria-label={
                !videoActivated
                  ? 'Ativar som e assistir ao vídeo'
                  : videoPaused
                    ? 'Continuar vídeo'
                    : 'Pausar vídeo'
              }
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleVideoClick();
                }
              }}
            >
              <video
                ref={videoRef}
                className="hero-video"
                src="/media/hero-vsl.mp4"
                poster="/media/hero-vsl-poster.webp"
                width="854"
                height="480"
                autoPlay
                muted
                loop={!videoActivated}
                playsInline
                preload="metadata"
                onTimeUpdate={() => {
                  const v = videoRef.current;
                  const bar = progressBarRef.current;
                  if (v && bar && v.duration > 0) {
                    bar.style.transform = `scaleX(${v.currentTime / v.duration})`;
                  }
                }}
                onEnded={() => {
                  if (videoActivated) {
                    if (progressBarRef.current) {
                      progressBarRef.current.style.transform = 'scaleX(1)';
                    }
                    setVideoEnded(true);
                    setVideoPaused(true);
                  }
                }}
              />

              {!videoActivated && (
                <button
                  type="button"
                  className="hv-sound-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleVideoClick();
                  }}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                  </svg>
                  <strong>Seu vídeo já começou</strong>
                  <span>Clique para ativar o som</span>
                </button>
              )}

              {videoActivated && !videoEnded && (
                <button
                  type="button"
                  className="hv-sound-badge"
                  onClick={handleToggleMute}
                  aria-label={videoMuted ? 'Ativar som' : 'Silenciar vídeo'}
                >
                  {videoMuted ? (
                    <>
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M16.5 12A4.5 4.5 0 0 0 14 7.97v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.796 8.796 0 0 0 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3 3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06a8.99 8.99 0 0 0 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4 9.91 6.09 12 8.18V4z" />
                      </svg>
                      Sem som
                    </>
                  ) : (
                    <>
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                      </svg>
                      Som ligado
                    </>
                  )}
                </button>
              )}

              {videoActivated && videoPaused && !videoEnded && (
                <button
                  type="button"
                  className="hv-play-btn"
                  aria-label="Continuar vídeo"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleVideoClick();
                  }}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </button>
              )}

              {videoEnded && (
                <div className="hv-ended">
                  <button
                    type="button"
                    className="hv-replay-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleVideoClick();
                    }}
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />
                    </svg>
                    Assistir novamente
                  </button>
                </div>
              )}

              {videoActivated && (
                <div className="hv-progress" aria-hidden="true">
                  <i ref={progressBarRef} style={{ transform: 'scaleX(0)' }} />
                </div>
              )}
            </div>
          </figure>
        </div>
        <div
          className="trim"
          aria-hidden="true"
          style={{ '--next': 'var(--paper)' } as React.CSSProperties}
        />
      </header>

      <section
        className="band"
        id="modelos"
        style={{ '--bg': 'var(--paper)', '--next': 'var(--brown)' } as React.CSSProperties}
      >
        <div className="shell">
          <h2>
            Veja os <span className="hl">moldes lindos</span> que você vai receber
          </h2>
          <p className="lead">
            Cada vestido vem com o molde peça por peça, com as medidas reais e a grade do PP ao G5.
            É só escolher o seu tamanho e cortar.
          </p>
        </div>
        <div className="mq" aria-label="Alguns modelos do pacote">
          <div className="mq-row mq-a">
            <ul className="mq-track models">
              {MODELS_ROW_A.map((item, idx) => (
                <li key={`a1-${idx}`}>
                  <img
                    src={item.img}
                    width="400"
                    height="600"
                    loading="lazy"
                    decoding="async"
                    alt={item.alt}
                  />
                  <span>{item.label}</span>
                </li>
              ))}
              {MODELS_ROW_A.map((item, idx) => (
                <li key={`a2-${idx}`} aria-hidden="true">
                  <img
                    src={item.img}
                    width="400"
                    height="600"
                    loading="lazy"
                    decoding="async"
                    alt=""
                  />
                  <span>{item.label}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mq-row mq-b">
            <ul className="mq-track models">
              {MODELS_ROW_B.map((item, idx) => (
                <li key={`b1-${idx}`}>
                  <img
                    src={item.img}
                    width="400"
                    height="600"
                    loading="lazy"
                    decoding="async"
                    alt={item.alt}
                  />
                  <span>{item.label}</span>
                </li>
              ))}
              {MODELS_ROW_B.map((item, idx) => (
                <li key={`b2-${idx}`} aria-hidden="true">
                  <img
                    src={item.img}
                    width="400"
                    height="600"
                    loading="lazy"
                    decoding="async"
                    alt=""
                  />
                  <span>{item.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="shell">
          <div className="section-cta">
            <a className="cta cta-green pulsa" href="#oferta">
              Quero os moldes
            </a>
          </div>
        </div>
        <div className="trim" aria-hidden="true" />
      </section>

      <section
        className="band dark"
        id="recebe"
        style={{ '--bg': 'var(--brown)', '--next': 'var(--paper)' } as React.CSSProperties}
      >
        <div className="shell">
          <h2>Veja tudo o que você vai receber hoje</h2>
          <p className="lead">
            O pacote completo de moldes, direto no seu WhatsApp e e-mail, pronto pra você começar a
            costurar.
          </p>
          <div className="deliver-stage">
            <img
              className="deliver-img"
              src="/media/produto-440.webp"
              srcSet="/media/produto-440.webp 400w, /media/produto-800.webp 680w"
              sizes="(min-width: 480px) 400px, 90vw"
              width="400"
              height="400"
              loading="lazy"
              decoding="async"
              alt="Pacote Moldes de Vestidos da Ana no tablet e no celular, com moldes impressos"
            />
          </div>
          <ul className="rc-grid">
            <li className="rc">
              <img
                className="rc-thumb"
                src="/media/recebe-custom-440.webp"
                width="45"
                height="45"
                loading="lazy"
                decoding="async"
                alt="Plataforma Moldes de Vestidos Evangélicos com mais de 50 moldes"
              />
              <span>
                <strong>Mais de 50 moldes de vestidos</strong> femininos e evangélicos
              </span>
            </li>
            <li className="rc">
              <img
                className="rc-thumb"
                src="/media/recebe-icon-3.webp"
                width="45"
                height="45"
                loading="lazy"
                decoding="async"
                alt="Molde peça por peça: frente, costas, manga e saia com as medidas"
              />
              <span>
                <strong>Molde peça por peça</strong>: frente, costas, manga e saia com as medidas
              </span>
            </li>
            <li className="rc">
              <img
                className="rc-thumb"
                src="/media/recebe-icon-1.webp"
                width="45"
                height="45"
                loading="lazy"
                decoding="async"
                alt="Do PP ao plus size com a grade de tamanhos de cada modelo"
              />
              <span>
                <strong>Do PP ao plus size</strong>, com a grade de tamanhos de cada modelo
              </span>
            </li>
            <li className="rc">
              <img
                className="rc-thumb"
                src="/media/recebe-icon-4.webp"
                width="45"
                height="45"
                loading="lazy"
                decoding="async"
                alt="Vestidos para culto, congresso, festa e dia a dia"
              />
              <span>
                Vestidos pra <strong>culto, congresso, festa e dia a dia</strong>: longo, midi,
                godê, três Marias e chemise
              </span>
            </li>
            <li className="rc">
              <img
                className="rc-thumb"
                src="/media/recebe-icon-2.webp"
                width="45"
                height="45"
                loading="lazy"
                decoding="async"
                alt="Foto do vestido pronto junto de cada molde"
              />
              <span>
                <strong>Foto do vestido pronto</strong> junto de cada molde
              </span>
            </li>
            <li className="rc">
              <img
                className="rc-thumb"
                src="/media/recebe-icon-5.webp"
                width="45"
                height="45"
                loading="lazy"
                decoding="async"
                alt="Guia Comece aqui mostrando como montar o molde"
              />
              <span>
                <strong>Guia “Comece aqui”</strong> mostrando como montar o molde
              </span>
            </li>
            <li className="rc rc-vip">
              <span className="rc-ico">
                <svg className="ico" aria-hidden="true">
                  <use href="#ico-infinito" />
                </svg>
              </span>
              <span>
                <strong>Acesso vitalício</strong> aos moldes, use quantas vezes quiser
              </span>
            </li>
          </ul>
          <div className="rc-bonus">
            <p className="rc-bonus-tag">
              <svg className="ico tw" aria-hidden="true">
                <use href="#ico-gift" />
              </svg>
              DE PRESENTE · 4 BÔNUS
            </p>
            <ul>
              <li>
                <svg className="ico tw" aria-hidden="true">
                  <use href="#ico-gift" />
                </svg>
                <span>Tabela de Medidas do PP ao Plus Size</span>
              </li>
              <li>
                <svg className="ico tw" aria-hidden="true">
                  <use href="#ico-gift" />
                </svg>
                <span>Guia de Tecidos</span>
              </li>
              <li>
                <svg className="ico tw" aria-hidden="true">
                  <use href="#ico-gift" />
                </svg>
                <span>Molde A4 Sem Erro</span>
              </li>
              <li>
                <svg className="ico tw" aria-hidden="true">
                  <use href="#ico-gift" />
                </svg>
                <span>Quanto Cobrar</span>
              </li>
            </ul>
          </div>
          <div className="section-cta">
            <a className="cta cta-green" href="#oferta">
              Quero receber os moldes
            </a>
          </div>
        </div>
        <div className="trim" aria-hidden="true" />
      </section>

      <section
        className="band"
        id="para-quem"
        style={{ '--bg': 'var(--paper)', '--next': 'var(--cream)' } as React.CSSProperties}
      >
        <div className="shell narrow">
          <h2>Material completo criado especialmente para quem:</h2>
          <ul className="who">
            <li>
              <span aria-hidden="true">⛪</span>Quer costurar os próprios vestidos pro culto e pros
              congressos
            </li>
            <li>
              <span aria-hidden="true">✂️</span>Já costura e cansou de perder tempo e tecido
              tentando acertar a modelagem
            </li>
            <li>
              <span aria-hidden="true">💰</span>Quer vender vestidos pras irmãs da igreja e ter uma
              renda extra em casa
            </li>
            <li>
              <span aria-hidden="true">🌸</span>Veste plus size e não acha molde que caia bem
            </li>
            <li>
              <span aria-hidden="true">🧵</span>Está começando e tem medo de errar o corte
            </li>
            <li>
              <span aria-hidden="true">🙏</span>Sente que Deus colocou um dom nas suas mãos e quer
              usar
            </li>
          </ul>
          <p className="who-foot">Você não precisa ser modelista para começar.</p>
          <div className="section-cta">
            <a className="cta cta-green" href="#bonus">
              Quero receber agora mesmo
            </a>
          </div>
        </div>
        <div className="trim" aria-hidden="true" />
      </section>

      <section
        className="band"
        id="bonus"
        style={{ '--bg': 'var(--cream)', '--next': 'var(--brown)' } as React.CSSProperties}
      >
        <div className="shell">
          <h2>
            Ainda hoje você também recebe <span className="hl">totalmente grátis:</span>
          </h2>
          <p className="lead">
            Mais de <strong>R$&nbsp;248,00</strong> em bônus pra você costurar com segurança e
            vender melhor
          </p>
          <div className="bonus-grid">
            {BONUSES.map((bonus) => (
              <article className="bonus-card" key={bonus.tag}>
                <p className="bonus-tag">{bonus.tag}</p>
                <img
                  src={bonus.img}
                  width="360"
                  height="360"
                  loading="lazy"
                  decoding="async"
                  alt={bonus.title}
                />
                <h3>{bonus.title}</h3>
                <p>{bonus.description}</p>
                <p className="bonus-price">
                  <s>{bonus.was}</s> <strong>Grátis hoje</strong>
                </p>
              </article>
            ))}
          </div>
          <div className="section-cta">
            <a className="cta cta-green" href="#oferta">
              Quero receber agora mesmo
            </a>
          </div>
        </div>
        <div className="trim" aria-hidden="true" />
      </section>

      <section
        className="band dark"
        id="depoimentos"
        style={{ '--bg': 'var(--brown)', '--next': 'var(--paper)' } as React.CSSProperties}
      >
        <div className="shell">
          <h2>Veja o que as irmãs que já receberam estão dizendo</h2>
          <p className="rating">
            <span className="stars" aria-hidden="true">
              ★★★★★
            </span>{' '}
            Mensagens de quem já costurou com os moldes
          </p>
        </div>
        <div
          className="dep-scroller"
          tabIndex={0}
          aria-label="Prints de depoimentos no WhatsApp. Arraste para o lado para ver mais."
        >
          <div className="dep-track">
            {DEPOIMENTOS.map((dep) => (
              <figure className="dep-card" key={dep.src}>
                <img
                  src={dep.src}
                  width="460"
                  height="817"
                  loading="lazy"
                  decoding="async"
                  alt={dep.alt}
                />
              </figure>
            ))}
          </div>
        </div>
        <div className="shell">
          <p className="dep-hint">Arraste para o lado para ver mais depoimentos</p>
          <div className="section-cta">
            <a className="cta cta-green" href="#oferta">
              Quero costurar o meu vestido
            </a>
          </div>
        </div>
        <div className="trim" aria-hidden="true" />
      </section>

      <section
        className="band"
        id="oferta"
        style={{ '--bg': 'var(--paper)', '--next': 'var(--cream)' } as React.CSSProperties}
      >
        <div className="shell">
          <h2>Escolha a sua opção</h2>
          <p className="lead">Oferta especial e envio imediato</p>
          <div className="plans">
            <article className="plan plan-basic">
              <p className="plan-name">Básico</p>
              <p className="plan-desc">O essencial para começar.</p>
              <ul className="plan-list">
                <li>
                  <svg className="pl-ok" aria-hidden="true">
                    <use href="#ico-check" />
                  </svg>
                  <span>20 moldes de vestidos</span>
                </li>
                <li>
                  <svg className="pl-ok" aria-hidden="true">
                    <use href="#ico-check" />
                  </svg>
                  <span>Medidas reais em cada peça</span>
                </li>
                <li>
                  <svg className="pl-ok" aria-hidden="true">
                    <use href="#ico-check" />
                  </svg>
                  <span>Acesso imediato</span>
                </li>
              </ul>
              <div className="plan-price">
                <p className="plan-was">
                  De <s>R$&nbsp;47,00</s> por
                </p>
                <p className="plan-now">R$&nbsp;10,90</p>
                <p className="plan-note">pagamento único à vista</p>
              </div>
              <a
                className="cta cta-ghost btn-checkout"
                href={checkoutUrls.basico}
                onClick={openUpsellModal}
              >
                Quero o Básico
              </a>
              <a className="plan-nudge plan-nudge-92" href="#plano-completo">
                <span>92% DAS COSTUREIRAS APROVEITAM A OFERTA COMPLETA:</span>
                <svg className="nudge-arrow" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M12 4v15m0 0-6.5-6.5M12 19l6.5-6.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </article>

            <article className="plan plan-full" id="plano-completo">
              <p className="plan-badge">
                <svg className="ico" aria-hidden="true">
                  <use href="#ico-star" />
                </svg>
                Mais escolhido
              </p>
              <div className="plan-full-head">
                <p className="plan-name">Completo</p>
                <p className="plan-desc">Todos os moldes + 4 bônus exclusivos.</p>
              </div>
              <img
                className="plan-full-img"
                src="/media/plano-completo-img.webp"
                width="560"
                height="373"
                loading="lazy"
                decoding="async"
                alt="Pacote Completo de Moldes de Vestidos com mais de 50 modelos, medidas reais e acesso vitalício"
              />
              <ul className="plan-list">
                <li>
                  <svg className="pl-ok" aria-hidden="true">
                    <use href="#ico-check" />
                  </svg>
                  <span>
                    <strong>Mais de 50 moldes</strong> de vestidos
                  </span>
                </li>
                <li>
                  <svg className="pl-ok" aria-hidden="true">
                    <use href="#ico-check" />
                  </svg>
                  <span>
                    Do PP ao <strong>plus size</strong>
                  </span>
                </li>
                <li>
                  <svg className="pl-ok" aria-hidden="true">
                    <use href="#ico-check" />
                  </svg>
                  <span>Foto do vestido pronto em cada molde</span>
                </li>
                <li>
                  <svg className="pl-ok" aria-hidden="true">
                    <use href="#ico-check" />
                  </svg>
                  <span>
                    Acesso imediato e <strong>vitalício</strong>
                  </span>
                </li>
                <li>
                  <svg className="pl-gift tw" aria-hidden="true">
                    <use href="#ico-gift" />
                  </svg>
                  <span className="chip">Bônus</span> Tabela de Medidas <s>R$&nbsp;67,00</s>
                </li>
                <li>
                  <svg className="pl-gift tw" aria-hidden="true">
                    <use href="#ico-gift" />
                  </svg>
                  <span className="chip">Bônus</span> Guia de Tecidos <s>R$&nbsp;47,00</s>
                </li>
                <li>
                  <svg className="pl-gift tw" aria-hidden="true">
                    <use href="#ico-gift" />
                  </svg>
                  <span className="chip">Bônus</span> Molde A4 Sem Erro <s>R$&nbsp;57,00</s>
                </li>
                <li>
                  <svg className="pl-gift tw" aria-hidden="true">
                    <use href="#ico-gift" />
                  </svg>
                  <span className="chip">Bônus</span> Quanto Cobrar <s>R$&nbsp;77,00</s>
                </li>
              </ul>
              <div className="plan-price">
                <p className="plan-save">Você economiza R$&nbsp;167,10</p>
                <p className="plan-was">
                  De <s>R$&nbsp;197,00</s> por
                </p>
                <p className="plan-now">R$&nbsp;29,90</p>
                <p className="plan-note">pagamento único à vista</p>
              </div>
              <a
                className="cta cta-green pulsa btn-checkout"
                href={checkoutUrls.completo}
                target="_blank"
                rel="noopener noreferrer"
              >
                Quero o Completo
              </a>
              <p className="plan-ultimo">
                <b>Último dia com desconto no pacote completo</b>
                <span>
                  A partir de <span>{tomorrowFormatted}</span>, o preço será ajustado.
                </span>
              </p>
            </article>
          </div>

          <div className="garantia">
            <img
              src="/media/selo-21-dias.webp"
              width="184"
              height="184"
              loading="lazy"
              decoding="async"
              alt="Selo de garantia de 21 dias"
            />
            <div>
              <p className="garantia-titulo">COMPRA COM GARANTIA</p>
              <p className="garantia-texto">
                Você pode comprar, usar os moldes por 21 dias e, se não gostar, pedir o reembolso de
                100% do valor.
              </p>
            </div>
          </div>
        </div>
        <div className="trim" aria-hidden="true" />
      </section>

      <section
        className="band"
        id="duvidas"
        style={{ '--bg': 'var(--cream)', '--next': 'var(--brown-deep)' } as React.CSSProperties}
      >
        <div className="shell narrow">
          <h2>Perguntas frequentes</h2>
          <div className="faq">
            {FAQS.map((item) => (
              <details
                key={item.question}
                className={item.featured ? 'faq-destaque' : undefined}
                open={item.featured}
              >
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
          <div className="section-cta">
            <a className="cta cta-green" href="#oferta">
              Quero os moldes
            </a>
          </div>
        </div>
        <div className="trim" aria-hidden="true" />
      </section>

      <footer className="foot">
        <div className="shell foot-inner">
          <p className="legal">
            Material digital com moldes de costura em PDF. Os resultados dependem da dedicação e do
            capricho de cada pessoa. Não é permitida a revenda ou redistribuição dos arquivos.
          </p>
          <p className="foot-copy">© 2026 Moldes Evangélicos · Todos os direitos reservados</p>
        </div>
      </footer>

      <dialog
        ref={dialogRef}
        className="up-modal"
        id="up-modal"
        aria-labelledby="up-title"
        onClose={() => setModalOpen(false)}
        onClick={(e) => {
          if (e.target === dialogRef.current) {
            closeUpsellModal();
          }
        }}
      >
        <button
          type="button"
          className="up-close"
          aria-label="Fechar"
          onClick={closeUpsellModal}
        >
          ×
        </button>
        <h2 id="up-title" tabIndex={-1}>
          Espera, amiga! Liberei uma condição que encerra em{' '}
          <span className="up-timer">{formattedTimer}</span>
        </h2>
        <ul className="up-list">
          <li>
            <svg className="ico" aria-hidden="true">
              <use href="#ico-check" />
            </svg>
            Mais de 50 moldes de vestidos, do PP ao plus size
          </li>
          <li>
            <svg className="ico" aria-hidden="true">
              <use href="#ico-check" />
            </svg>
            <span>
              <strong>4 bônus:</strong> medidas, tecidos, molde A4 e quanto cobrar
            </span>
          </li>
        </ul>
        <p className="up-price">
          <strong>
            <span>R$</span>18,90
          </strong>
          <s>De R$&nbsp;197,00</s>
        </p>
        <a
          className="cta cta-green btn-checkout"
          href={checkoutUrls.upsell}
          target="_blank"
          rel="noopener noreferrer"
        >
          Quero o Completo por R$18,90
        </a>
        <a
          className="up-skip btn-checkout"
          href={checkoutUrls.basico}
          target="_blank"
          rel="noopener noreferrer"
        >
          Não, quero só o Básico por R$10,90
        </a>
      </dialog>
    </>
  );
}
