import React, { useState } from 'react';
import { Download, Smartphone, Share, PlusSquare, CheckCircle2, Globe, ShieldCheck, Zap, QrCode } from 'lucide-react';
import { usePWA } from '../hooks/usePWA';
import { useTheme } from '../hooks/useTheme';
import { ShareAppModal } from '../components/ShareAppModal';

export const InstallPage: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, promptInstall } = usePWA();
  const { logoSrc } = useTheme();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', paddingBottom: 24 }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div style={{ width: 84, height: 84, margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img src={logoSrc} alt="IEIA" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </div>
        <h1 style={{ fontSize: 'clamp(1.45rem, 3.5vw, 1.95rem)', fontWeight: 700, marginBottom: 8, letterSpacing: '-0.015em' }}>
          Instalar Hinos & Cânticos
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', maxWidth: 480, margin: '0 auto' }}>
          Tenha acesso instantâneo aos hinos e cânticos como um aplicativo nativo no seu iPhone, Android ou Computador.
        </p>
      </div>

      {/* Vantagens */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 32 }}>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: 'var(--radius-md)', padding: 16 }}>
          <Zap size={22} color="var(--red-primary)" style={{ marginBottom: 8 }} />
          <h4 style={{ fontWeight: 650, fontSize: '0.95rem', marginBottom: 4 }}>Acesso Instantâneo</h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
            Abre direto na tela sem barras do navegador ou distrações.
          </p>
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: 'var(--radius-md)', padding: 16 }}>
          <ShieldCheck size={22} color="var(--red-primary)" style={{ marginBottom: 8 }} />
          <h4 style={{ fontWeight: 650, fontSize: '0.95rem', marginBottom: 4 }}>100% Offline Real</h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
            Todos os 581 hinos gravados no aparelho. Abra qualquer letra e pesquise sem gastar dados móveis ou WiFi.
          </p>
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: 'var(--radius-md)', padding: 16 }}>
          <Globe size={22} color="var(--red-primary)" style={{ marginBottom: 8 }} />
          <h4 style={{ fontWeight: 650, fontSize: '0.95rem', marginBottom: 4 }}>Leve e Rápido</h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
            Não ocupa centenas de megabytes de espaço como apps pesados.
          </p>
        </div>
      </div>

      {isInstalled ? (
        <div style={{ textAlign: 'center', padding: '36px 20px', background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: 'var(--radius-lg)' }}>
          <CheckCircle2 size={48} color="var(--red-primary)" style={{ margin: '0 auto 12px' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 8 }}>
            O Hinos & Cânticos já está instalado!
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
            Você já está utilizando o modo aplicativo instalado. Aproveite a leitura e boa adoração!
          </p>
        </div>
      ) : isInstallable ? (
        <div style={{ textAlign: 'center', padding: '32px 24px', background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: 'var(--radius-lg)', marginBottom: 28 }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 8 }}>
            Pronto para Instalação no seu Navegador
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: 20 }}>
            Seu navegador suporta instalação direta em 1 toque.
          </p>
          <button
            onClick={promptInstall}
            className="btn btn-primary"
            style={{ padding: '12px 24px', fontSize: '0.95rem', fontWeight: 550 }}
          >
            <Download size={18} /> Instalar Hinos & Cânticos
          </button>
        </div>
      ) : null}

      {/* Guia Safari / iPhone */}
      <section style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: 'var(--radius-lg)', padding: '24px', marginTop: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <Smartphone size={22} color="var(--red-primary)" />
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Como Instalar no iPhone e iPad (Safari)</h3>
        </div>

        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 20 }}>
          No sistema iOS da Apple, a instalação é realizada facilmente através do navegador Safari:
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
            <span style={{ minWidth: 30, height: 30, borderRadius: '50%', background: 'var(--red-light)', color: 'var(--red-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.9rem' }}>
              1
            </span>
            <div>
              <p style={{ fontWeight: 650, fontSize: '0.92rem' }}>Abra no Safari e toque em Partilhar</p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                Localize o botão de partilha <Share size={15} style={{ display: 'inline', verticalAlign: 'middle' }} /> na barra de ferramentas inferior do Safari.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
            <span style={{ minWidth: 30, height: 30, borderRadius: '50%', background: 'var(--red-light)', color: 'var(--red-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.9rem' }}>
              2
            </span>
            <div>
              <p style={{ fontWeight: 650, fontSize: '0.92rem' }}>Toque em "Adicionar ao ecrã principal"</p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                Role a folha de opções que surgiu até encontrar <PlusSquare size={15} style={{ display: 'inline', verticalAlign: 'middle' }} /> <strong>Adicionar ao ecrã principal</strong> (Add to Home Screen).
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
            <span style={{ minWidth: 30, height: 30, borderRadius: '50%', background: 'var(--red-light)', color: 'var(--red-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.9rem' }}>
              3
            </span>
            <div>
              <p style={{ fontWeight: 650, fontSize: '0.92rem' }}>Confirme em "Adicionar"</p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                No canto superior direito, confirme o toque em <strong>Adicionar</strong>. O ícone do Hinos & Cânticos aparecerá na sua tela de início!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Guia Android e Chrome */}
      <section style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: 'var(--radius-lg)', padding: '24px', marginTop: 20 }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 12 }}>Instalação no Android e Computador (Chrome / Edge)</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.6 }}>
          1. Toque nos <strong>três pontinhos</strong> no canto superior direito do navegador.<br />
          2. Selecione <strong>"Instalar aplicativo"</strong> ou <strong>"Adicionar à tela inicial"</strong>.<br />
          3. O aplicativo será adicionado aos seus programas ou tela inicial.
        </p>
      </section>

      {/* Cartaz e QR Code para a Igreja / Liderança */}
      <section style={{ background: 'var(--bg-card)', border: '1.5px solid rgba(200, 29, 37, 0.25)', borderRadius: 'var(--radius-lg)', padding: '24px', marginTop: 20, textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 44, height: 44, borderRadius: '50%', background: 'var(--red-tint)', marginBottom: 12 }}>
          <QrCode size={22} color="var(--red-primary)" />
        </div>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 6 }}>
          QR Code para Folhetos e Projeção na Igreja
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', maxWidth: 480, margin: '0 auto 16px' }}>
          Gere o código QR em alta definição para afixar na entrada do templo, imprimir nos boletins semanais ou exibir nos ecrãs de projeção da igreja.
        </p>
        <button
          onClick={() => setIsShareModalOpen(true)}
          className="btn btn-primary"
          style={{ padding: '10px 20px', display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: '0.9rem', fontWeight: 650 }}
        >
          <QrCode size={18} />
          <span>Ver e Baixar QR Code do Hinário</span>
        </button>
      </section>

      <ShareAppModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />
    </div>
  );
};
