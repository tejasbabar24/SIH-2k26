// Shared reusable UI components

import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export function StatCard({ label, value, unit, change, icon: Icon, color = 'navy' }) {
  const colors = {
    navy: { bg: 'bg-[#0f2d5c]', text: 'text-white', iconBg: 'bg-white/10' },
    green: { bg: 'bg-[#1a6b3c]', text: 'text-white', iconBg: 'bg-white/10' },
    orange: { bg: 'bg-[#e07b2a]', text: 'text-white', iconBg: 'bg-white/10' },
    white: { bg: 'bg-white', text: 'text-gray-800', iconBg: 'bg-blue-50' },
  };
  const c = colors[color] || colors.white;
  const isPositive = change > 0;
  const isNegative = change < 0;

  return (
    <div className={`${c.bg} ${c.text} rounded-lg p-4 border border-gray-100 shadow-sm`}>
      <div className="flex items-start justify-between">
        <div>
          <p className={`text-xs font-medium uppercase tracking-wider ${color === 'white' ? 'text-gray-500' : 'text-white/70'} mb-1`}>{label}</p>
          <p className="text-2xl font-bold tracking-tight">{value}</p>
          {unit && <p className={`text-xs ${color === 'white' ? 'text-gray-500' : 'text-white/60'} mt-0.5`}>{unit}</p>}
        </div>
        {Icon && (
          <div className={`${c.iconBg} rounded-lg p-2`}>
            <Icon size={20} className={color === 'white' ? 'text-[#0f2d5c]' : 'text-white/80'} />
          </div>
        )}
      </div>
      {change !== undefined && (
        <div className={`flex items-center gap-1 mt-2 text-xs ${color === 'white' ? '' : 'text-white/80'}`}>
          {isPositive && <TrendingUp size={12} className="text-green-400" />}
          {isNegative && <TrendingDown size={12} className="text-red-400" />}
          {!isPositive && !isNegative && <Minus size={12} />}
          <span className={isPositive ? 'text-green-400' : isNegative ? 'text-red-400' : ''}>
            {isPositive ? '+' : ''}{change}%
          </span>
          <span className={color === 'white' ? 'text-gray-400' : 'text-white/50'}>vs last year</span>
        </div>
      )}
    </div>
  );
}

export function Badge({ children, color = 'gray' }) {
  const colors = {
    green: 'bg-green-100 text-green-800 border-green-200',
    red: 'bg-red-100 text-red-800 border-red-200',
    orange: 'bg-orange-100 text-orange-800 border-orange-200',
    blue: 'bg-blue-100 text-blue-800 border-blue-200',
    purple: 'bg-purple-100 text-purple-800 border-purple-200',
    navy: 'bg-[#0f2d5c]/10 text-[#0f2d5c] border-[#0f2d5c]/20',
    gray: 'bg-gray-100 text-gray-700 border-gray-200',
    yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    teal: 'bg-teal-100 text-teal-800 border-teal-200',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${colors[color] || colors.gray}`}>
      {children}
    </span>
  );
}

export function SectionHeader({ title, subtitle, actions }) {
  return (
    <div className="flex items-start justify-between mb-4">
      <div>
        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
        {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Card({ children, className = '', padding = true }) {
  return (
    <div className={`bg-white border border-gray-200 rounded-lg shadow-sm ${padding ? 'p-4' : ''} ${className}`}>
      {children}
    </div>
  );
}

export function LoadingOverlay({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center h-40 gap-3">
      <div className="w-8 h-8 border-3 border-[#0f2d5c] border-t-transparent rounded-full animate-spin" style={{ borderWidth: '3px' }} />
      <p className="text-sm text-gray-500 font-medium">{message}</p>
    </div>
  );
}

export function DemoBanner({ message = 'BHUNIRNAY PROTOTYPE · DEMO DATA · SIH 26019' }) {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-2 flex items-center gap-2 text-xs text-amber-700 font-medium">
      <div className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
      {message}
    </div>
  );
}

export function RiskBadge({ level }) {
  if (level === 'Low') return <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded">● Low</span>;
  if (level === 'Medium') return <span className="inline-flex items-center gap-1 text-xs font-semibold text-orange-700 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded">● Medium</span>;
  if (level === 'High') return <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded">● High</span>;
  return <span className="text-xs text-gray-500">{level}</span>;
}

export function GovButton({ children, onClick, variant = 'primary', size = 'md', className = '', disabled }) {
  const variants = {
    primary: 'bg-[#0f2d5c] hover:bg-[#1a3f7a] text-white',
    green: 'bg-[#1a6b3c] hover:bg-[#228b4e] text-white',
    outline: 'border border-[#0f2d5c] text-[#0f2d5c] hover:bg-[#0f2d5c]/5',
    outlineGreen: 'border border-[#1a6b3c] text-[#1a6b3c] hover:bg-[#1a6b3c]/5',
    orange: 'bg-[#e07b2a] hover:bg-[#c86a20] text-white',
    ghost: 'text-gray-600 hover:bg-gray-100',
  };
  const sizes = {
    sm: 'text-xs px-3 py-1.5',
    md: 'text-sm px-4 py-2',
    lg: 'text-sm px-5 py-2.5 font-semibold',
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-1.5 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
}

export function InfoRow({ label, value, mono }) {
  return (
    <div className="flex items-start justify-between py-2 border-b border-gray-100 last:border-0 gap-4">
      <span className="text-xs text-gray-500 shrink-0">{label}</span>
      <span className={`text-xs font-medium text-gray-800 text-right ${mono ? 'font-mono' : ''}`}>{value}</span>
    </div>
  );
}

export function PageHeader({ label, title, subtitle, actions, breadcrumb }) {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-5">
      {breadcrumb && (
        <p className="text-xs text-gray-500 mb-2 font-medium">{breadcrumb}</p>
      )}
      {label && (
        <p className="text-[10px] font-bold text-[#1a6b3c] uppercase tracking-widest mb-1">{label}</p>
      )}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0f2d5c] leading-tight">{title}</h1>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-2 shrink-0 flex-wrap">{actions}</div>}
      </div>
    </div>
  );
}
