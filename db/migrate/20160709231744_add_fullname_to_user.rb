class AddFullnameToUser < ActiveRecord::Migration
  def change
    add_column :users, :fullame, :string
  end
end
