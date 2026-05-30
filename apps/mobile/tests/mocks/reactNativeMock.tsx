import React from "react";

type HostProps = Record<string, unknown> & { children?: React.ReactNode };

function createHostComponent(name: string) {
  return function HostComponent({ children, ...props }: HostProps) {
    return React.createElement(name, props, children);
  };
}

export const View = createHostComponent("View");
export const Text = createHostComponent("Text");
export const Pressable = createHostComponent("Pressable");
export const TextInput = createHostComponent("TextInput");
export const ScrollView = createHostComponent("ScrollView");
export const Image = createHostComponent("Image");

export const StyleSheet = {
  create: <T extends Record<string, unknown>>(styles: T): T => styles,
  flatten: (style: unknown): unknown => style
};

export const Platform = { OS: "ios", select: <T,>(values: Record<string, T>): T | undefined => values.ios ?? values.default };
export const NativeModules = {};
export const UIManager = {};
export const findNodeHandle = () => null;