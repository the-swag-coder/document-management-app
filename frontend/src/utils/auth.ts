export function isLoggedIn(): boolean {
  if (typeof window === 'undefined') return false;
  return (!!sessionStorage.getItem(`${process.env.NEXT_PUBLIC_APP}_TOKEN`) &&
    !!sessionStorage.getItem(`${process.env.NEXT_PUBLIC_APP}_ROLE`));
}

export function login({ token, role }): void {
  sessionStorage.setItem(`${process.env.NEXT_PUBLIC_APP}_TOKEN`, token);
  sessionStorage.setItem(`${process.env.NEXT_PUBLIC_APP}_ROLE`, role);
}

export function logout(): void {
  sessionStorage.removeItem(`${process.env.NEXT_PUBLIC_APP}_TOKEN`);
  sessionStorage.removeItem(`${process.env.NEXT_PUBLIC_APP}_ROLE`);
}
