/* Port of BHSGroupDesignSystem.Input — labelled field with Sky-Blue focus ring. */
import { useState, type ChangeEvent, type ReactNode } from 'react';

export function Input({
  label, type = 'text', placeholder, value, defaultValue, helper, error, disabled = false,
  iconLeft = null, onChange,
}: {
  label?: string; type?: string; placeholder?: string; value?: string; defaultValue?: string;
  helper?: string; error?: string; disabled?: boolean; iconLeft?: ReactNode;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}) {
  const [focus, setFocus] = useState(false);
  const id = label ? 'in-' + label.replace(/\s+/g, '-').toLowerCase() : undefined;
  const borderColor = error ? '#D92D20' : focus ? '#4CA8E4' : '#E5E7EB';
  return (
    <div style={{ fontFamily: 'var(--font-sans)', width: '100%' }}>
      {label && (
        <label htmlFor={id} style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#15233F', marginBottom: 6 }}>
          {label}
        </label>
      )}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        background: disabled ? '#F4F6FA' : '#fff', border: '1.5px solid ' + borderColor,
        borderRadius: 'var(--radius-md)', padding: '0 14px', height: 44,
        boxShadow: focus && !error ? '0 0 0 3px rgba(76,168,228,0.25)' : 'none',
        transition: 'border-color 120ms cubic-bezier(.4,0,.2,1), box-shadow 120ms cubic-bezier(.4,0,.2,1)',
      }}>
        {iconLeft && <span style={{ color: '#9AA3AF', display: 'flex' }}>{iconLeft}</span>}
        <input id={id} type={type} placeholder={placeholder} value={value} defaultValue={defaultValue}
          disabled={disabled} onChange={onChange} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
          style={{ border: 'none', outline: 'none', background: 'transparent', fontFamily: 'var(--font-sans)',
            fontSize: 15, color: '#15233F', width: '100%', height: '100%' }} />
      </div>
      {(helper || error) && (
        <div style={{ fontSize: 12, marginTop: 6, color: error ? '#D92D20' : '#8A93A6' }}>{error || helper}</div>
      )}
    </div>
  );
}
