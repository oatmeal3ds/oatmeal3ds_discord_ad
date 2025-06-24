window.addEventListener('DOMContentLoaded', async () => {
  const url = 'https://discord.com/api/guilds/1288276550655152198/widget.json';
  const serverIcon = document.getElementById('server-icon');
  const serverName = document.getElementById('server-name');
  const onlineCount = document.getElementById('online-count');
  const membersDiv = document.getElementById('members');
  const joinLink = document.getElementById('join-link');
  const fallbackIcon = 'https://u.cubeupload.com/Oatmeal3ds123/lickycat.gif';

  // Full list of bot usernames (case-insensitive, ignores spaces)
  const botNames = [
    "Ticket System",
    "lemming",
    "cat",
    "sleepy lemming",
    "DISBOARD",
    "Double Counter",
    "Make it a Quote",
    "turtle",
    "Raftar.xyz",
    "Roles",
    "Beemo",
    "Sapphire"
  ].map(name => name.replace(/\s+/g, '').toLowerCase());

  function setServerIcon(url, fallback) {
    serverIcon.onerror = null; // Prevent infinite loop
    serverIcon.src = url;
    serverIcon.onerror = () => {
      serverIcon.onerror = null;
      serverIcon.src = fallback;
    };
  }

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch widget data');
    const data = await response.json();

    // Server Info
    serverName.textContent = data.name;

    // Improved logic: use fallbackIcon if icon is missing or null, or if image fails to load
    if (data.icon) {
      setServerIcon(
        `https://cdn.discordapp.com/icons/${data.id}/${data.icon}.webp?size=128`,
        fallbackIcon
      );
    } else {
      setServerIcon(fallbackIcon, fallbackIcon);
    }
    serverIcon.alt = data.name + ' Icon';

    // Filter out bots by username
    const realMembers = data.members.filter(member => {
      const username = member.username.replace(/\s+/g, '').toLowerCase();
      return !botNames.includes(username);
    });

    // Online Count (real users only)
    onlineCount.textContent = `${realMembers.length} online`;

    // Members
    membersDiv.innerHTML = '';
    realMembers.slice(0, 10).forEach((member, idx) => {
      const container = document.createElement('div');
      container.className = 'member';
      container.setAttribute('data-idx', idx);
      container.style.setProperty('--member-delay', `${idx * 70}ms`);
      const avatar = document.createElement('img');
      avatar.src = member.avatar_url;
      avatar.alt = member.username;
      avatar.setAttribute('data-idx', idx);
      avatar.style.setProperty('--member-delay', `${idx * 70}ms`);
      container.appendChild(avatar);
      const name = document.createElement('span');
      name.textContent = member.username;
      container.appendChild(name);
      membersDiv.appendChild(container);
    });
    if (realMembers.length > 10) {
      const more = document.createElement('div');
      more.style.color = '#aaa';
      more.style.fontSize = '0.95em';
      more.textContent = `+${realMembers.length - 10} more online...`;
      membersDiv.appendChild(more);
    }

    // Join Button
    joinLink.href = data.instant_invite;
    joinLink.textContent = 'Join Server';
  } catch (e) {
    serverName.textContent = 'Failed to load Discord widget.';
    onlineCount.textContent = '';
    membersDiv.innerHTML = '';
    joinLink.style.display = 'none';
    // Always show your custom fallback
    serverIcon.onerror = null;
    serverIcon.src = fallbackIcon;
  }
});
