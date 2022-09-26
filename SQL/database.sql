CREATE DATABASE expenses_tracker;
create role tracker login password 'tracker220';
grant all privileges on database expenses_tracker to tracker;
