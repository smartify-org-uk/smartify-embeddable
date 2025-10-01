import { useEmbeddableState } from '@embeddable.com/react';
import React, { useCallback, useMemo } from 'react';

import Button from '../../Button';

type VariableKey = string;

type KeyTuple = [
  VariableKey | undefined,
  VariableKey | undefined,
  VariableKey | undefined,
  VariableKey | undefined,
  VariableKey | undefined,
  VariableKey | undefined,
  VariableKey | undefined,
  VariableKey | undefined,
  VariableKey | undefined,
];

type ValueTuple = [
  unknown | undefined,
  unknown | undefined,
  unknown | undefined,
  unknown | undefined,
  unknown | undefined,
  unknown | undefined,
  unknown | undefined,
  unknown | undefined,
  unknown | undefined,
];

type EmbeddableValues = Record<VariableKey, unknown>;
type SetEmbeddableValues = (
  value: EmbeddableValues | ((prev: EmbeddableValues) => EmbeddableValues),
) => void;

const PAIR_COUNT = 9;

export type Props = {
  label?: string;
  disabled?: boolean;
  showSpinner?: boolean;
  icon?: React.ReactNode;
  sourceKeys: KeyTuple;
  targetKeys: KeyTuple;
  transform?: (values: ValueTuple) => ValueTuple;
  onCopied?: (payload: { from: ValueTuple; to: ValueTuple }) => void;
};

export default function CopyOnClickButton({
  label,
  disabled,
  showSpinner,
  icon,
  sourceKeys,
  targetKeys,
  transform,
  onCopied,
}: Props) {
  const resolvedLabel = label && label.trim().length > 0 ? label : 'Copy values';

  const buttonStyle = useMemo(
    () => ({
      borderColor: '#1B1B1B',
      backgroundColor: '#1B1B1B',
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: 600,
      borderRadius: '8px',
      height: 40,
    }),
    [],
  );

  const [variables, setVariables] = useEmbeddableState<EmbeddableValues>({}) as [
    EmbeddableValues,
    SetEmbeddableValues,
  ];

  const handleClick = useCallback(
    (_event: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) {
        return;
      }

      const fromValues = sourceKeys.map((key) => (key ? variables?.[key] : undefined)) as ValueTuple;

      let toValues: ValueTuple;
      try {
        const candidate = transform
          ? transform([...fromValues] as ValueTuple)
          : ([...fromValues] as ValueTuple);

        if (!Array.isArray(candidate)) {
          console.error('CopyOnClickButton transform must return an array of values.');
          return;
        }

        const normalized = [...candidate];
        if (normalized.length < PAIR_COUNT) {
          while (normalized.length < PAIR_COUNT) {
            normalized.push(undefined);
          }
        }

        toValues = normalized.slice(0, PAIR_COUNT) as ValueTuple;
      } catch (error) {
        console.error('CopyOnClickButton failed to transform values', error);
        return;
      }

      const hasTargetKey = targetKeys.some((key) => !!key);

      if (hasTargetKey) {
        try {
          setVariables((currentValues) => {
            const nextValues = { ...currentValues } as EmbeddableValues;

            targetKeys.forEach((key, index) => {
              if (!key) return;
              nextValues[key] = toValues[index];
            });

            return nextValues;
          });
        } catch (error) {
          console.error('CopyOnClickButton failed to write values', error);
          return;
        }
      }

      try {
        onCopied?.({ from: fromValues, to: toValues });
      } catch (error) {
        console.error('CopyOnClickButton failed to emit onCopied', error);
      }
    },
    [disabled, sourceKeys, targetKeys, variables, transform, onCopied, setVariables],
  );

  return (
    //<div className="w-full h-full flex items-end justify-end">
    <div className="w-full h-full flex items-center justify-center">
      <Button
        buttonLabel={resolvedLabel}
        showSpinner={showSpinner}
        disabled={disabled}
        icon={icon}
        onClick={handleClick}
        ariaLabel={resolvedLabel}
        style={buttonStyle}
      />
    </div>
  );
}
