import React from "react";

type HostProps = Record<string, unknown> & { children?: React.ReactNode };

function createLayoutComponent(name: string) {
  function LayoutComponent({ children, ...props }: HostProps) {
    return React.createElement(name, props, children);
  }

  LayoutComponent.Screen = function Screen({ children, ...props }: HostProps) {
    return React.createElement(`${name}.Screen`, props, children);
  };

  return LayoutComponent;
}

export const Stack = createLayoutComponent("Stack");
export const Tabs = createLayoutComponent("Tabs");

export function Redirect({ href }: { href: string }) {
  return React.createElement("Redirect", { href });
}

export function Link({ children, href }: { children?: React.ReactNode; href: string }) {
  return React.createElement("Link", { href }, children);
}

export function useLocalSearchParams() {
  return {};
}

export function useRouter() {
  return {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn()
  };
}