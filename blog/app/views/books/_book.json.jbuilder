json.extract! book, :id, :is_valid, :name, :created_at, :updated_at
json.url book_url(book, format: :json)