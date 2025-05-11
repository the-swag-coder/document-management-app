import ProfileDropdown from './ProfileDropdown';

export default function Header({ title }: {title: string}) {
  return (
    <header className="flex items-center justify-between px-6 py-4 font-quicksand">
      <h1 className="text-xl font-bold"></h1>
      <div className="flex items-center space-x-4">
        <ProfileDropdown/>
      </div>
    </header>
  );
}